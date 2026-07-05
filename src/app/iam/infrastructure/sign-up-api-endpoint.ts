import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../domain/model/user.entity';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { SignUpAssembler } from './sign-up-assembler';
import { SignUpResponse } from './sign-up-response';

const signUpApiEndpointUrl = `${environment.supplyWokPlatformBaseUrl}${environment.authenticationEndpointPath}${environment.authenticationSignUpEndpointPath}`;

/**
 * Encapsulates IAM sign-up HTTP operations.
 */
export class SignUpApiEndpoint {
  constructor(
    private readonly http: HttpClient,
    private readonly assembler: SignUpAssembler,
  ) {}

  signUp(command: SignUpCommand): Observable<User> {
    return this.http
      .post<SignUpResponse>(signUpApiEndpointUrl, this.assembler.toRequestFromCommand(command))
      .pipe(map((response) => this.assembler.toEntityFromResponse(response)));
  }
}
