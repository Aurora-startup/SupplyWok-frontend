import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../domain/model/user.entity';
import { SignInCommand } from '../domain/model/sign-in.command';
import { SignInAssembler } from './sign-in-assembler';
import { SignInResponse } from './sign-in-response';

const signInApiEndpointUrl = `${environment.supplyWokPlatformBaseUrl}${environment.authenticationEndpointPath}${environment.authenticationSignInEndpointPath}`;

/**
 * Encapsulates IAM sign-in HTTP operations.
 */
export class SignInApiEndpoint {
  constructor(
    private readonly http: HttpClient,
    private readonly assembler: SignInAssembler,
  ) {}

  signIn(command: SignInCommand): Observable<User> {
    return this.http
      .post<SignInResponse>(signInApiEndpointUrl, this.assembler.toRequestFromCommand(command))
      .pipe(map((response) => this.assembler.toEntityFromResponse(response)));
  }
}
