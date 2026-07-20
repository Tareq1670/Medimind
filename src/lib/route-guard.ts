export function authorizeRoute(
  role: string | undefined | null,
  allowedRoles: string[]
): string | null {
  if (!role) return "/login";
  if (allowedRoles.includes(role)) return null;
  return "/dashboard";
}

export function hasAccess(
  role: string | undefined | null,
  allowedRoles: string[]
): boolean {
  if (!role) return false;
  return allowedRoles.includes(role);
}
