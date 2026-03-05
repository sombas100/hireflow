export function requireRole(user: { role: string } | null, roles: string[]) {
  if (!user) return { ok: false, status: 401, message: "Unauthorized" };
  if (!roles.includes(user.role)) return { ok: false, status: 403, message: "Forbidden" };
  return { ok: true as const };
}