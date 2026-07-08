import { BaseEntity } from '../../../shared/infrastructure/base-entity';
import { AppRoleScope } from '../../../shared/application/role-routing';

export class Profile implements BaseEntity {
  id: number | string | null;
  profileType: AppRoleScope;
  businessName: string;
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  district: string;
  city: string;
  country: string;
  supportContact: string;
  emailNotifications: boolean;
  smsNotifications: boolean;

  constructor(profile: {
    id?: number | string | null;
    profileType?: AppRoleScope;
    businessName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    street?: string;
    district?: string;
    city?: string;
    country?: string;
    supportContact?: string;
    emailNotifications?: boolean;
    smsNotifications?: boolean;
  } = {}) {
    this.id = profile.id ?? null;
    this.profileType = profile.profileType ?? 'restaurant';
    this.businessName = profile.businessName ?? '';
    this.firstName = profile.firstName ?? '';
    this.lastName = profile.lastName ?? '';
    this.email = profile.email ?? '';
    this.street = profile.street ?? '';
    this.district = profile.district ?? '';
    this.city = profile.city ?? '';
    this.country = profile.country ?? '';
    this.supportContact = profile.supportContact ?? '';
    this.emailNotifications = profile.emailNotifications ?? true;
    this.smsNotifications = profile.smsNotifications ?? false;
  }

  clone(): Profile {
    return new Profile({ ...this });
  }
}
