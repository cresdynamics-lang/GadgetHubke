/** Signed-in operator shown in the management chrome. Multi-user invites come later. */

export type StaffIdentity = {
  name: string;
  role: string;
  email: string;
};

export function currentStaff(): StaffIdentity {
  return {
    name: process.env.MANAGEMENT_STAFF_NAME || "Admin",
    role: process.env.MANAGEMENT_STAFF_ROLE || "Owner",
    email: process.env.MANAGEMENT_STAFF_EMAIL || "admin@gadgethub.ke",
  };
}
