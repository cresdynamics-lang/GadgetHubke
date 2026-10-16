#!/usr/bin/env python3
"""Ship dist/client to DigitalOcean (do-new) in ~40 MB packs (resumable).

Usage:
  python3 scripts/ship-packs.py              # build lists + ship
  python3 scripts/ship-packs.py --lists-only
  python3 scripts/ship-packs.py --ship-only  # use existing /tmp/gh-packs lists

Remote: deploy@143.198.169.74 (Host do-new) → /var/www/sites/gadgethubke.com
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CLIENT = ROOT / "dist" / "client"
PACK_DIR = Path("/tmp/gh-packs")
TARGET_BYTES = 40 * 1024 * 1024
# Prefer SSH config Host "do-new"; fall back to explicit key + IP.
REMOTE_HOST = os.environ.get("GH_REMOTE_HOST", "do-new")
REMOTE_ROOT = "/var/www/sites/gadgethubke.com"
REMOTE_CLIENT = f"{REMOTE_ROOT}/dist/client"
REMOTE_PACKS = f"{REMOTE_ROOT}/.upload-packs"
SSH_IDENTITY = os.path.expanduser(
    os.environ.get("GH_SSH_IDENTITY", "~/.ssh/do_migration_ed25519")
)
REMOTE_USER_HOST = os.environ.get("GH_REMOTE", "deploy@143.198.169.74")

def _ssh_base() -> list[str]:
    # Use Host alias when set to do-new; otherwise key + user@ip.
    if REMOTE_HOST == "do-new" or REMOTE_HOST.endswith("do-new"):
        target = "do-new"
        return [
            "ssh",
            "-o",
            "ConnectTimeout=25",
            "-o",
            "ServerAliveInterval=15",
            "-o",
            "ServerAliveCountMax=8",
            "-o",
            "BatchMode=yes",
            target,
        ]
    return [
        "ssh",
        "-i",
        SSH_IDENTITY,
        "-o",
        "IdentitiesOnly=yes",
        "-o",
        "ConnectTimeout=25",
        "-o",
        "ServerAliveInterval=15",
        "-o",
        "ServerAliveCountMax=8",
        "-o",
        "BatchMode=yes",
        REMOTE_USER_HOST,
    ]


def _scp_base() -> list[str]:
    if REMOTE_HOST == "do-new" or REMOTE_HOST.endswith("do-new"):
        return [
            "scp",
            "-o",
            "ConnectTimeout=25",
            "-o",
            "ServerAliveInterval=15",
            "-o",
            "BatchMode=yes",
        ]
    return [
        "scp",
        "-i",
        SSH_IDENTITY,
        "-o",
        "IdentitiesOnly=yes",
        "-o",
        "ConnectTimeout=25",
        "-o",
        "ServerAliveInterval=15",
        "-o",
        "BatchMode=yes",
    ]


SSH = _ssh_base()
SCP = _scp_base()
# scp remote path prefix (host alias or user@ip)
SCP_REMOTE = "do-new" if (REMOTE_HOST == "do-new" or REMOTE_HOST.endswith("do-new")) else REMOTE_USER_HOST


def run(cmd: list[str], timeout: int = 600) -> subprocess.CompletedProcess:
    print("+", " ".join(cmd[:10]) + (" ..." if len(cmd) > 10 else ""), flush=True)
    try:
        return subprocess.run(cmd, timeout=timeout)
    except subprocess.TimeoutExpired as e:
        print(f"  TIMEOUT after {timeout}s: {cmd[0]}", flush=True)
        # Best-effort kill of hung scp/ssh children
        if e.process is not None:
            try:
                e.process.kill()
            except OSError:
                pass
        return subprocess.CompletedProcess(cmd, returncode=124)


def build_lists() -> list[dict]:
    PACK_DIR.mkdir(parents=True, exist_ok=True)
    files: list[tuple[str, int]] = []
    for dirpath, dirnames, filenames in os.walk(CLIENT):
        dirnames.sort()
        filenames.sort()
        for name in filenames:
            p = Path(dirpath) / name
            try:
                sz = p.stat().st_size
            except OSError:
                continue
            files.append((p.relative_to(CLIENT).as_posix(), sz))

    packs: list[list[str]] = []
    cur: list[str] = []
    cur_sz = 0
    for rel, sz in files:
        if cur and cur_sz + sz > TARGET_BYTES:
            packs.append(cur)
            cur, cur_sz = [], 0
        cur.append(rel)
        cur_sz += sz
    if cur:
        packs.append(cur)

    size_map = dict(files)
    manifest = []
    for i, plist in enumerate(packs, 1):
        list_path = PACK_DIR / f"pack-{i:03d}.txt"
        list_path.write_text("\n".join(plist) + "\n")
        total = sum(size_map[r] for r in plist)
        manifest.append({"n": i, "files": len(plist), "bytes": total})
        print(f"pack-{i:03d}: {len(plist)} files, {total / 1024 / 1024:.1f} MB")

    (PACK_DIR / "manifest.json").write_text(json.dumps(manifest, indent=2))
    print(f"TOTAL packs={len(packs)} files={len(files)}")
    return manifest


def ship(manifest: list[dict], *, continue_on_fail: bool = True) -> int:
    done_log = PACK_DIR / "done.txt"
    done = set(done_log.read_text().split()) if done_log.exists() else set()

    r = run(SSH + [f"mkdir -p {REMOTE_CLIENT} {REMOTE_PACKS}"], timeout=60)
    if r.returncode != 0:
        print("cannot reach server / mkdir failed", file=sys.stderr)
        return 1

    ok = fail = 0
    for item in manifest:
        tag = f"pack-{item['n']:03d}"
        if tag in done:
            print(f"SKIP {tag}", flush=True)
            ok += 1
            continue

        list_path = PACK_DIR / f"{tag}.txt"
        tar_path = PACK_DIR / f"{tag}.tar"
        mb = item["bytes"] / 1024 / 1024
        print(f"\n=== {tag}: {item['files']} files, {mb:.1f} MB ===", flush=True)

        if tar_path.exists():
            tar_path.unlink()
        env = os.environ.copy()
        env["COPYFILE_DISABLE"] = "1"  # skip macOS xattrs in tar
        print("+ tar -cf", tar_path.name, flush=True)
        r = subprocess.run(
            ["tar", "-cf", str(tar_path), "-C", str(CLIENT), "-T", str(list_path)],
            timeout=180,
            env=env,
        )
        if r.returncode != 0:
            print(f"FAIL tar {tag}", flush=True)
            fail += 1
            if not continue_on_fail:
                break
            continue

        shipped = False
        for attempt in range(1, 5):
            print(f"  scp attempt {attempt}/4 ...", flush=True)
            r = run(SCP + [str(tar_path), f"{REMOTE_HOST}:{REMOTE_PACKS}/{tag}.tar"], timeout=900)
            if r.returncode != 0:
                time.sleep(8)
                continue
            extract = (
                f"set -e; cd {REMOTE_CLIENT}; tar -xf {REMOTE_PACKS}/{tag}.tar; "
                f"rm -f {REMOTE_PACKS}/{tag}.tar; echo EXTRACT_OK_{tag}"
            )
            r = run(SSH + [extract], timeout=240)
            if r.returncode == 0:
                shipped = True
                break
            time.sleep(8)

        if tar_path.exists():
            tar_path.unlink()

        if shipped:
            with done_log.open("a") as f:
                f.write(tag + "\n")
            done.add(tag)
            ok += 1
            print(f"OK {tag}", flush=True)
        else:
            fail += 1
            print(f"FAIL {tag}", flush=True)
            if not continue_on_fail:
                break

    print(f"\nRESULT ok={ok} fail={fail} total={len(manifest)}", flush=True)
    run(SSH + [f"du -sm {REMOTE_CLIENT}; find {REMOTE_CLIENT} -type f | wc -l"], timeout=90)
    return 1 if fail else 0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--lists-only", action="store_true")
    ap.add_argument("--ship-only", action="store_true")
    ap.add_argument("--stop-on-fail", action="store_true")
    args = ap.parse_args()

    if not CLIENT.is_dir():
        print(f"missing {CLIENT}; run npm run build first", file=sys.stderr)
        return 1

    if args.ship_only:
        manifest = json.loads((PACK_DIR / "manifest.json").read_text())
    else:
        manifest = build_lists()
        if args.lists_only:
            return 0

    return ship(manifest, continue_on_fail=not args.stop_on_fail)


if __name__ == "__main__":
    raise SystemExit(main())
