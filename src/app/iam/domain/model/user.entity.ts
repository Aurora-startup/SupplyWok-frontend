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
    if (this.roles.includes('ROLE_SUPPLIER')) {
      return 'Supplier';
    }

    if (this.roles.includes('ROLE_RESTAURANT')) {
      return 'Restaurant';
    }

    return null;
  }
}
