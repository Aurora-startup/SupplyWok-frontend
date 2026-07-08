import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { SignInCommand } from '../domain/model/sign-in.command';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { User } from '../domain/model/user.entity';
import { SignInApiEndpoint } from './sign-in-api-endpoint';
import { SignInAssembler } from './sign-in-assembler';
import { SignUpApiEndpoint } from './sign-up-api-endpoint';
import { SignUpAssembler } from './sign-up-assembler';
import { UsersApiEndpoint } from './users-api-endpoint';
import { UsersAssembler } from './users-assembler';

/**
 * Infrastructure facade that exposes IAM endpoint operations.
 */
@Injectable({ providedIn: 'root' })
export class IamApi extends BaseApi {
  private readonly signInEndpoint: SignInApiEndpoint;
  private readonly signUpEndpoint: SignUpApiEndpoint;
  private readonly usersEndpoint: UsersApiEndpoint;

  constructor(http: HttpClient) {
    super(http);
    this.signInEndpoint = new SignInApiEndpoint(http, new SignInAssembler());
    this.signUpEndpoint = new SignUpApiEndpoint(http, new SignUpAssembler());
    this.usersEndpoint = new UsersApiEndpoint(http, new UsersAssembler());
  }

  signIn(command: SignInCommand): Observable<User> {
    return this.signInEndpoint.signIn(command);
  }

  signUp(command: SignUpCommand): Observable<User> {
    return this.signUpEndpoint.signUp(command);
  }

  getUsers(): Observable<User[]> {
    return this.usersEndpoint.getAll();
  }

  getUserById(userId: number): Observable<User> {
    return this.usersEndpoint.getById(userId);
  }
}
