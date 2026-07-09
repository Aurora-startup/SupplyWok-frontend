/**
 * Resource payload sent to the sign-up endpoint.
 */
export interface SignUpRequest {
  email: string;
  password: string;
  role: string;
}
