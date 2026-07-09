import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface ProfileResource extends BaseResource {
  profileType: string;
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
}

export interface ProfileResponse extends BaseResponse {
  profile?: ProfileResource;
}
