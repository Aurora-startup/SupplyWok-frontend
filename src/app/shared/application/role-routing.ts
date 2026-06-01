import { UserRole } from '../../iam/domain/model/user.entity';

export type AppRoleScope = 'restaurant' | 'supplier';

export function normalizeRole(role: UserRole | string | null | undefined): AppRoleScope | null {
  const normalizedRole = role?.toString().trim().toLowerCase();

  if (normalizedRole === 'restaurant' || normalizedRole === 'supplier') {
    return normalizedRole;
  }

  return null;
}

export function getHomeByRole(role: UserRole | string | null | undefined): string {
  return normalizeRole(role) === 'supplier' ? '/supplier/dashboard' : '/restaurant/dashboard';
}

export function getScopedPathByRole(role: UserRole | string | null | undefined, section: string): string {
  return `/${normalizeRole(role) ?? 'restaurant'}/${section}`;
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
