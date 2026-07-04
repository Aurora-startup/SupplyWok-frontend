import { BaseResource } from '../../shared/infrastructure/base-response';

/**
 * Resource returned by IAM user queries.
 */
export interface UserResource extends BaseResource {
  id: number;
  email: string;
  roles: string[];
}
