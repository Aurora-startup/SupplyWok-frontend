import { User } from '../domain/model/user.entity';
import { UserAssembler } from './assemblers/user.assembler';
import { UserResource } from './users-response';

/**
 * Maps user query resources into IAM entities.
 */
export class UsersAssembler {
  toEntityFromResource(resource: UserResource): User {
    return UserAssembler.toEntityFromResource(resource);
  }

  toEntitiesFromResponse(resources: UserResource[]): User[] {
    return resources.map((resource) => this.toEntityFromResource(resource));
  }
}
