import { User } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class UserEntity implements User {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Exclude()
  password: string;

  @Expose()
  isEmailVerified: boolean;

  @Expose()
  avatarId: number;

  @Expose()
  blocked: boolean;

  @Expose()
  email: string;

  @Expose()
  roles: string[];

  @Exclude()
  refreshToken: string[];

  @Expose()
  provider: string;
  @Expose()
  googleId: string;
  @Expose()
  githubId: string;
  @Expose()
  discordId: string;
}
