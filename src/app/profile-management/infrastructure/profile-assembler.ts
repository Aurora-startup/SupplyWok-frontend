import { AppRoleScope } from '../../shared/application/role-routing';
import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Profile } from '../domain/model/profile.entity';
import { ProfileResource, ProfileResponse } from './profile-response';

export class ProfileAssembler implements BaseAssembler<Profile, ProfileResource, ProfileResponse> {
  toEntityFromResource(resource: ProfileResource): Profile {
    return new Profile({
      id: resource.id ?? null,
      profileType: this.toProfileType(resource.profileType),
      businessName: resource.businessName ?? '',
      firstName: resource.firstName ?? '',
      lastName: resource.lastName ?? '',
      email: resource.email ?? '',
      street: resource.street ?? '',
      district: resource.district ?? '',
      city: resource.city ?? '',
      country: resource.country ?? '',
      supportContact: resource.supportContact ?? '',
      emailNotifications: resource.emailNotifications ?? true,
      smsNotifications: resource.smsNotifications ?? false,
    });
  }

  toResourceFromEntity(entity: Profile): ProfileResource {
    return {
      id: entity.id,
      profileType: entity.profileType.toUpperCase(),
      businessName: entity.businessName,
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
      street: entity.street,
      district: entity.district,
      city: entity.city,
      country: entity.country,
      supportContact: entity.supportContact,
      emailNotifications: entity.emailNotifications,
      smsNotifications: entity.smsNotifications,
    };
  }

  toEntitiesFromResponse(response: ProfileResponse): Profile[] {
    return response.profile ? [this.toEntityFromResource(response.profile)] : [];
  }

  private toProfileType(profileType: string | null | undefined): AppRoleScope {
    return profileType?.toLowerCase() === 'supplier' ? 'supplier' : 'restaurant';
  }
}
