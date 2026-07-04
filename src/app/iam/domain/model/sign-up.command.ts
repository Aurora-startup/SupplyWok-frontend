import { UserRole } from './user.entity';

/**
 * Captures values required to register a new IAM account.
 */
export class SignUpCommand {
  private _email: string;
  private _password: string;
  private _role: UserRole;

  constructor(props: { email: string; password: string; role: UserRole }) {
    this._email = props.email;
    this._password = props.password;
    this._role = props.role;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }

  get role(): UserRole {
    return this._role;
  }

  set role(value: UserRole) {
    this._role = value;
  }
}
