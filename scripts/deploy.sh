#!/usr/bin/env bash
# Deploy gadgethubke.com to the VPS (DigitalOcean, PM2 app "gadgethub").
#
#   npm run deploy            build, back up, upload, restart, smoke-test
#   SKIP_BUILD=1 npm run deploy   reuse the existing dist/
#
# Only committed code that is already on GitHub (origin/main) can go live,
# so the server always matches the repo. Set ALLOW_DIRTY=1 to override.
set -euo pipefail

HOST="${DEPLOY_HOST:-deploy@143.198.169.74}"
ROOT="/var/www/sites/gadgethubke.com"
RUN_AS="site_gadget"
PM2="sudo -n -u $RUN_AS env PM2_HOME=$ROOT/.pm2 pm2"
SITE="https://gadgethubke.com"

cd "$(dirname "$0")/.."

if [[ "${ALLOW_DIRTY:-}" != "1" ]]; then
  if [[ -n "$(git status --porcelain --untracked-files=no)" ]]; then
    echo "✗ Uncommitted changes. Commit and push first (or ALLOW_DIRTY=1)." >&2
    exit 1
  fi
  git fetch -q origin main
  if [[ "$(git rev-parse HEAD)" != "$(git rev-parse origin/main)" ]]; then
    echo "✗ HEAD is not origin/main. Push (or pull) first so the server matches GitHub." >&2
    exit 1
  fi
fi

if [[ "${SKIP_BUILD:-}" != "1" ]]; then
  echo "→ Building"
  npm run build
fi

stamp="$(date +%Y%m%d-%H%M%S)"
echo "→ Backing up server build ($stamp)"
ssh -o BatchMode=yes "$HOST" "cd $ROOT && sudo -n -u $RUN_AS tar czf .dist-server-backup-$stamp.tgz dist/server"

export COPYFILE_DISABLE=1
RSYNC_PATH="sudo -n -u $RUN_AS rsync"
echo "→ Uploading server bundle"
rsync -az --checksum --delete --exclude '._*' --rsync-path="$RSYNC_PATH" dist/server/ "$HOST:$ROOT/dist/server/"
echo "→ Uploading client files (old hashed assets kept for cached pages)"
rsync -az --checksum --delete --filter='P _astro/**' --exclude '._*' --rsync-path="$RSYNC_PATH" dist/client/ "$HOST:$ROOT/dist/client/"

echo "→ Uploading PM2 config and admin tool"
rsync -az --rsync-path="$RSYNC_PATH" ecosystem.config.cjs "$HOST:$ROOT/ecosystem.config.cjs"
ssh -o BatchMode=yes "$HOST" "sudo -n -u $RUN_AS mkdir -p $ROOT/scripts"
rsync -az --rsync-path="$RSYNC_PATH" scripts/set-admin-password.mjs "$HOST:$ROOT/scripts/set-admin-password.mjs"

echo "→ Restarting app"
ssh -o BatchMode=yes "$HOST" "cd $ROOT && $PM2 startOrReload ecosystem.config.cjs --update-env >/dev/null && for i in \$(seq 1 30); do curl -s -o /dev/null http://127.0.0.1:3030/ && exit 0; sleep 1; done; echo 'app did not come up' >&2; exit 1"

echo "→ Smoke test"
fail=0
for path in / /iphone /iphone/iphone-17-pro /ipad /mac /watch /airpods /journal /sitemap.xml; do
  code="$(curl -s -o /dev/null -w '%{http_code}' -m 60 "$SITE$path")"
  printf '  %s %s\n' "$code" "$path"
  [[ "$code" == "200" ]] || fail=1
done
items="$(curl -s -m 60 "$SITE/feeds/google-merchant.xml" | grep -c '<item>' || true)"
echo "  Google feed items: $items"
[[ "$items" -gt 0 ]] || fail=1

if [[ "$fail" == "1" ]]; then
  echo "✗ Smoke test failed. Roll back with:" >&2
  echo "  ssh $HOST \"cd $ROOT && sudo -n -u $RUN_AS tar xzf .dist-server-backup-$stamp.tgz && $PM2 restart gadgethub\"" >&2
  exit 1
fi
echo "✓ Deployed $(git rev-parse --short HEAD)"
