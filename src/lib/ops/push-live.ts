import { liveSnapshot } from "../analytics/presence";
import { opsLinked } from "./link";

function configured() {
  return opsLinked() && Boolean(process.env.OPS_CATALOG_URL?.trim() && process.env.WEBSITE_SYNC_SECRET?.trim());
}

async function pushLiveSnapshot() {
  if (!configured()) return;
  const base = process.env.OPS_CATALOG_URL!.replace(/\/$/, "");
  const secret = process.env.WEBSITE_SYNC_SECRET!;
  try {
    const response = await fetch(`${base}/api/website/live`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(liveSnapshot()),
    });
    if (!response.ok) console.error("[ops-live]", response.status, await response.text().catch(() => ""));
  } catch (error) {
    console.error("[ops-live]", error);
  }
}

let started = false;

/** Copy the same live-visitor snapshot website admin uses into ops every 5 seconds. */
export function startLivePush() {
  if (started || !configured()) return;
  started = true;
  void pushLiveSnapshot();
  setInterval(() => {
    void pushLiveSnapshot();
  }, 5_000);
}
