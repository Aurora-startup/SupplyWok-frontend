import { User } from '../../domain/model/user.entity';

export class UserAssembler {
  static toEntityFromResource(resource: any): User {
    return new User({
      id: resource.id,
      email: resource.email,
      roles: Array.isArray(resource.roles) ? resource.roles : [],
      token: resource.token ?? null,
    });
  }
}
