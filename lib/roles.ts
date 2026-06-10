const ROLE_LABEL_OVERRIDES: Record<string, string> = {
  HOD: "Head of Department",
  SUPER_ADMIN: "Super Admin",
  PRINCIPAL_OFFICER: "Principal Officer",
};
export function formatRoleLabel(roleKey: string): string {
  const key = String(roleKey || "").toUpperCase();
  if (ROLE_LABEL_OVERRIDES[key]) return ROLE_LABEL_OVERRIDES[key];
  return key
    .toLowerCase()
    .split("_")
    .map((s) => (s ? s[0].toUpperCase() + s.slice(1) : s))
    .join(" ");
}
