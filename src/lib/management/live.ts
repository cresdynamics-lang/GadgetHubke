/**
 * Live presence. Empty until a storefront beacon writes sessions to KV.
 * Shape matches the management Live visitors page.
 */

export type LiveSnapshot = {
  now: number;
  lookingAtProduct: number;
  inCart: number;
  atCheckout: number;
  visitors: {
    id: string;
    town: string;
    device: string;
    page: string;
    from: string;
    onSite: string;
  }[];
  sources: { label: string; count: number }[];
  activity: { when: string; text: string }[];
  pages: { path: string; count: number }[];
  ready: boolean;
};

export async function getLiveSnapshot(): Promise<LiveSnapshot> {
  return {
    now: 0,
    lookingAtProduct: 0,
    inCart: 0,
    atCheckout: 0,
    visitors: [],
    sources: [],
    activity: [],
    pages: [],
    ready: false,
  };
}
