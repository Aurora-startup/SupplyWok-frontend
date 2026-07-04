/**
 * Captures credentials required to authenticate an IAM session.
 */
export class SignInCommand {
  private _email: string;
  private _password: string;

  constructor(props: { email: string; password: string }) {
    this._email = props.email;
    this._password = props.password;
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
}
