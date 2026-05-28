import { UserRole } from '../../domain/model/user.entity';

export function resolveHomeRoute(role: UserRole | null | undefined): string {
  return role === 'Supplier' ? '/supplier/dashboard' : '/dashboard';
}
