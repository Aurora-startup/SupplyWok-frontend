import { SignUpCommand } from '../domain/model/sign-up.command';
import { User } from '../domain/model/user.entity';
import { UserAssembler } from './assemblers/user.assembler';
import { SignUpRequest } from './sign-up.request';
import { SignUpResponse } from './sign-up-response';

/**
 * Maps sign-up commands and endpoint payloads.
 */
export class SignUpAssembler {
  toRequestFromCommand(command: SignUpCommand): SignUpRequest {
    return {
      email: command.email,
      password: command.password,
      roles: [command.role === 'Supplier' ? 'ROLE_SUPPLIER' : 'ROLE_RESTAURANT'],
    };
  }

  toEntityFromResponse(response: SignUpResponse): User {
    return UserAssembler.toEntityFromResource({
      id: response.id,
      email: response.email,
      roles: Array.isArray(response.roles) ? response.roles : [],
    });
  }
}
