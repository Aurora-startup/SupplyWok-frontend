export type UserRole = 'Restaurant' | 'Supplier';
export type SubscriptionTier = 'Premium' | 'Enterprise';

/**
 * Entity representing a User in the IAM context.
 */
export class User {
  id: number;
  email: string;
  password?: string;
  phoneNumber: string;
  role: UserRole;
  subscription: SubscriptionTier;

  constructor(id: number, email: string, phoneNumber: string, role: UserRole, subscription: SubscriptionTier, password?: string) {
    this.id = id;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.role = role;
    this.subscription = subscription;
    this.password = password;
  }
}
