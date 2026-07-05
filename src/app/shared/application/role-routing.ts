import { UserRole } from '../../iam/domain/model/user.entity';

export type AppRoleScope = 'restaurant' | 'supplier';

export function normalizeRole(role: UserRole | string | null | undefined): AppRoleScope | null {
  const normalizedRole = role?.toString().trim().toLowerCase();

  if (normalizedRole === 'restaurant' || normalizedRole === 'role_restaurant') {
    return 'restaurant';
  }

  if (normalizedRole === 'supplier' || normalizedRole === 'role_supplier') {
    return 'supplier';
  }

  return null;
}

export function getHomeByRole(role: UserRole | string | null | undefined): string | null {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === 'supplier') {
    return '/supplier/dashboard';
  }

  if (normalizedRole === 'restaurant') {
    return '/restaurant/dashboard';
  }

  return null;
}

export function getScopedPathByRole(role: UserRole | string | null | undefined, section: string): string | null {
  const normalizedRole = normalizeRole(role);
  return normalizedRole ? `/${normalizedRole}/${section}` : null;
}

export function getRoleFromPath(path: string): AppRoleScope | null {
  if (path.startsWith('/restaurant')) {
    return 'restaurant';
  }

  if (path.startsWith('/supplier')) {
    return 'supplier';
  }

  return null;
}
