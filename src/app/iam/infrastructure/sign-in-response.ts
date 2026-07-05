import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource returned by the sign-in endpoint.
 */
export interface SignInResource extends BaseResource {
  id: number;
  email: string;
  roles?: string[];
  token: string;
}

/**
 * Response shape returned by the sign-in endpoint.
 */
export interface SignInResponse extends BaseResponse, SignInResource {}
