/**
 * Log of Stanbic payment notifications, so staff can see every credit the bank reported,
 * matched to an order or not. Ids and amounts only: no names, phone numbers or balances.
 */
import { kvGetJson, kvSetJson } from "../admin/kv";

const KEY = "gh:bank-notices:v1";
const KEEP = 500;

export type BankNotice = {
  at: string;
  transactionType: string;
  transId: string;
  billRef: string;
  thirdPartyRef: string;
  transTime: string;
  amountKes?: number;
  orderId?: string;
  result: "paid" | "unmatched" | "unverified" | "amount_mismatch" | "already_paid" | "ignored";
  hasSecureHash: boolean;
  senderAuthenticated: boolean;
};

export async function recordBankNotice(notice: BankNotice) {
  try {
    const all = await kvGetJson<BankNotice[]>(KEY, []);
    all.push(notice);
    await kvSetJson(KEY, all.slice(-KEEP));
  } catch (e) {
    console.warn("[stanbic-webhook] could not save notice", e instanceof Error ? e.message : e);
  }
}

export async function listBankNotices(): Promise<BankNotice[]> {
  return kvGetJson<BankNotice[]>(KEY, []);
}
