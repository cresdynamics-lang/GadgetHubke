/**
 * The public shop and the operations app are standalone.
 * Catalog, prices, visitors, orders and messages stay on the site that owns them.
 */
export function opsLinked() {
  return false;
}
