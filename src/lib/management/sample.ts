import { currentStaff } from "./staff";

/**
 * Signed-in staff identity for the management chrome (from server env, not dummy people).
 * All admin figures come from real stores: orders, trade-ins, Lipa, messages and live visitors.
 */
export const sampleStaff = currentStaff();

/** Live staff invites are not wired yet — keep empty (no dummy people). */
export const sampleStaffList: { name: string; email: string; role: string; status: string }[] = [];
