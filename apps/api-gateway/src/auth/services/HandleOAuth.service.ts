import {
  AuthRepository,
  tempRegisterDate,
  UserRepository,
  VerifyResetTokenRepository,
} from '@/app/common';

import { CloudinaryService } from '@/app/common/cloudinary/cloudinary.service';
import bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

interface OAuthUserData {
  // id: string;
  email: string;
  username: string;
  avatarUrl: string;
  provider: string;
  providerId: string;
  password: string;
}

@Injectable()
export class HandleIOAuth {
  constructor(
    protected authRepository: AuthRepository,
    protected userRepository: UserRepository,
    protected verifyResetTokenRepository: VerifyResetTokenRepository,
    protected JwtService: JwtService,

    protected cloudinaryService: CloudinaryService,
    // protected readonly prisma: PrismaService,
  ) {}

  protected async handleOauthLogin(profile): Promise<User> {
    // console.log(email);
    let user = await this.authRepository.findByEmail(profile.email);

    const payload = {
      id: user.id,
      username: user.username,
      roles: user.roles,
    };
    const accessTokenJwt = await this.JwtService.signAsync(payload, {
      expiresIn: '7d',
    });
    const refreshTokenJwt = await this.JwtService.signAsync(payload, {
      expiresIn: '31d',
    });

    const token = await this.verifyResetTokenRepository.findUnique({
      userId: user.id,
    });

    if (!token) {
      await this.verifyResetTokenRepository.createToken({
        userId: user.id,
        token: refreshTokenJwt,
        tempDate: tempRegisterDate,
      });
      return user;
    } else {
      await this.verifyResetTokenRepository.deleteToken(user.id);
      await this.verifyResetTokenRepository.createToken({
        userId: user.id,
        token: refreshTokenJwt,
        tempDate: tempRegisterDate,
      });
    }

    await this.authRepository.updateProfile(user.id, {
      refreshToken: [accessTokenJwt],
    });
    return user;
  }
  async uploadAvatarToCloudinary(avatarUrl: string, id: string) {
    if (!avatarUrl) return null;
    const publicId = `microServiceNestjs/avatars/${id}_${Date.now()}`;
    return await this.cloudinaryService.uploadFromUrl(avatarUrl, publicId);
  }

  async createUserViaOauth(userData: OAuthUserData) {
    const { email, username, provider, avatarUrl, providerId, password } =
      userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const providerField = {
      [`${provider}Id`]: providerId,
    };

    const avatarPublicId = `microServiceNestjs/avatars/${providerId}_${Date.now()}`;
    let cloudinaryAvatar = null;

    if (avatarUrl) {
      cloudinaryAvatar = await this.cloudinaryService.uploadFromUrl(
        avatarUrl,
        avatarPublicId,
      );
    }

    return this.authRepository.create({
      email,
      username,
      isEmailVerified: true,
      password: hashedPassword,
      provider,
      ...providerField,
      avatar: cloudinaryAvatar
        ? {
            create: {
              url: cloudinaryAvatar.url,
              publicId: cloudinaryAvatar.publicId,
            },
          }
        : undefined,
    });
  }
}
