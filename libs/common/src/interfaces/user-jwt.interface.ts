import { UserRequest } from './user-request.interface';

export interface UserJwt extends UserRequest {
  lat: number;
  exp: number;
}
