import { BadRequestException, Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { HandleIOAuth } from '../passport/HandleOAuth';
import {
  AuthRepository,
  UserRepository,
  VerifyResetTokenRepository,
} from '@/app/common';
import { CloudinaryService } from '@/app/common/cloudinary/cloudinary.service';

@Injectable()
export class GoogleService extends HandleIOAuth {
  constructor(
    protected readonly userRepository: UserRepository,
    protected readonly authRepository: AuthRepository,
    protected readonly verifyResetTokenRepository: VerifyResetTokenRepository,

    protected readonly jwtService: JwtService,
    protected readonly cloudinaryService: CloudinaryService,
    // protected readonly prisma: PrismaService,
  ) {
    super(
      authRepository,
      userRepository,
      verifyResetTokenRepository,
      jwtService,
      cloudinaryService,
    );
  }

  async validateGoogleUser(profile: any) {
    try {
      // console.log('test', profile);
      return await this.handleOauthLogin(profile);
    } catch (error) {
      throw new BadRequestException('Something wrong happened', error);
    }
  }
}
