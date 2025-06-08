import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  id: number;

  username: string;
  createdAt: Date;

  updatedAt: Date;

  @Exclude()
  password: string;

  isEmailVerified: boolean;
  avatarId: number;

  blocked: boolean;
  email: string;
  roles: string[];
  refreshToken: string[];

  provider: string;
  googleId: string;
  githubId: string;
  discordId: string;
}
