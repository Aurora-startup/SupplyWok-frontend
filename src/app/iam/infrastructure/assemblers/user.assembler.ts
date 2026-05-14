import { User } from '../../domain/model/user.entity';

/**
 * Assembler class responsible for transforming user data between the 
 * Infrastructure layer (DTOs) and the Domain layer (Entities).
 */
export class UserAssembler {
  /**
   * Transforms an API response object into a collection of domain entities.
   * @param response The raw API response.
   * @returns An array of User instances.
   */
  static toEntitiesFromResponse(response: any): User[] {
    const usersArray = Array.isArray(response) ? response : (response.users || []);
    return usersArray.map((resource: any) => this.toEntityFromResource(resource));
  }

  /**
   * Transforms a single API resource (DTO) into a domain entity.
   * @param resource The raw resource data from the API.
   * @returns A new instance of User.
   */
  static toEntityFromResource(resource: any): User {
    return new User(
      resource.id,
      resource.email,
      resource.phoneNumber,
      resource.role,
      resource.subscription,
      resource.password
    );
  }

  /**
   * Transforms a domain entity back into a resource format suitable for API requests.
   * @param entity The domain entity to convert.
   * @returns A DTO.
   */
  static toResourceFromEntity(entity: User): any {
    return {
      id: entity.id,
      email: entity.email,
      password: entity.password,
      phoneNumber: entity.phoneNumber,
      role: entity.role,
      subscription: entity.subscription,
    };
  }
}
