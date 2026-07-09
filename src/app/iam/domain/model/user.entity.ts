export type UserRole = 'Restaurant' | 'Supplier';
export type BackendRole = 'ROLE_RESTAURANT' | 'ROLE_SUPPLIER' | string;

/**
 * Entity representing an authenticated IAM user session.
 */
export class User {
  id: number;
  email: string;
  roles: BackendRole[];
  token: string | null;

  constructor({
    id,
    email,
    roles = [],
    token = null,
  }: {
    id: number;
    email: string;
    roles?: BackendRole[];
    token?: string | null;
  }) {
    this.id = id;
    this.email = email;
    this.roles = roles;
    this.token = token;
  }

  get role(): UserRole | null {
    const roleString = (r: any) => (typeof r === 'string' ? r : (r?.name || r?.authority || String(r))).toUpperCase();

    if (this.roles.some(r => roleString(r) === 'ROLE_SUPPLIER' || roleString(r) === 'SUPPLIER')) {
      return 'Supplier';
    }

    if (this.roles.some(r => roleString(r) === 'ROLE_RESTAURANT' || roleString(r) === 'RESTAURANT')) {
      return 'Restaurant';
    }

    return null;
  }
}
