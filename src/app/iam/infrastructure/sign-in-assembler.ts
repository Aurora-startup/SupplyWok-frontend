import { SignInCommand } from '../domain/model/sign-in.command';
import { User } from '../domain/model/user.entity';
import { UserAssembler } from './assemblers/user.assembler';
import { SignInRequest } from './sign-in.request';
import { SignInResponse } from './sign-in-response';

/**
 * Maps sign-in commands and endpoint payloads.
 */
export class SignInAssembler {
  toRequestFromCommand(command: SignInCommand): SignInRequest {
    return {
      email: command.email,
      password: command.password,
    };
  }

  toEntityFromResponse(response: SignInResponse): User {
    return UserAssembler.toEntityFromResource({
      id: response.id,
      email: response.email,
      roles: Array.isArray(response.roles) ? response.roles : [],
      token: response.token,
    });
  }
}
