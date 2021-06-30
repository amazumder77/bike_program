/**
 * Interface for a JWT Token return object
 */
export interface JWTTokenRO {
  expires_in: number;
  token: string;
  user_id?: number;
}
