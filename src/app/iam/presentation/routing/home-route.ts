import { UserRole } from '../../domain/model/user.entity';
import { getHomeByRole } from '../../../shared/application/role-routing';

export function resolveHomeRoute(role: UserRole | null | undefined): string {
  return getHomeByRole(role);
}
