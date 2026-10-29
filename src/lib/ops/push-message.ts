import type { ContactMessage } from "../leads/messages";
import { opsLinked } from "./link";
import { pushCustomerToOps } from "./push-customer";

function configured() {
  return opsLinked() && Boolean(process.env.OPS_CATALOG_URL?.trim() && process.env.WEBSITE_SYNC_SECRET?.trim());
}

export async function pushMessageToOps(row: ContactMessage) {
  if (!configured()) return;
  const base = process.env.OPS_CATALOG_URL!.replace(/\/$/, "");
  const secret = process.env.WEBSITE_SYNC_SECRET!;
  try {
    const response = await fetch(`${base}/api/website/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: row.id,
        kind: row.kind,
        name: row.name,
        phone: row.phone,
        topic: row.topic || "",
        message: row.message || "",
        orderRef: row.orderRef || "",
        createdAt: row.createdAt,
      }),
    });
    if (!response.ok) console.error("[ops-message]", response.status, await response.text().catch(() => ""));
  } catch (error) {
    console.error("[ops-message]", error);
  }
  void pushCustomerToOps({ name: row.name, phone: row.phone, source: "checkout" });
}
