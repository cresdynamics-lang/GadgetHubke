function configured() {
  return Boolean(process.env.OPS_CATALOG_URL?.trim() && process.env.WEBSITE_SYNC_SECRET?.trim());
}

export async function pushCustomerToOps(input: {
  name?: string;
  email?: string;
  phone?: string;
  source: "trade-in" | "lipa" | "checkout";
}) {
  if (!configured()) return;
  const filled = [input.name?.trim(), input.email?.trim(), input.phone?.trim()].filter(Boolean).length;
  if (filled < 2) return;
  const base = process.env.OPS_CATALOG_URL!.replace(/\/$/, "");
  const secret = process.env.WEBSITE_SYNC_SECRET!;
  try {
    const response = await fetch(`${base}/api/website/customers`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: input.name || "",
        email: input.email || "",
        phone: input.phone || "",
        source: input.source,
      }),
    });
    if (!response.ok) console.error("[ops-customer]", response.status, await response.text().catch(() => ""));
  } catch (error) {
    console.error("[ops-customer]", error);
  }
}
