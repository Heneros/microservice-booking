export class AuthEntity {
  id: number;

  username: string;

  email: string;

  refreshToken?: string;

  blocked: true;
}
