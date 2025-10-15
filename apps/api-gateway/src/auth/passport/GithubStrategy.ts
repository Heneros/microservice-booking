import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { HandleIOAuth } from '../services/HandleOAuth.service';
import { AuthRepository } from '@/libs/common/src';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private config: ConfigService,
    private readonly handleIOauth: HandleIOAuth,
    private readonly authRepository: AuthRepository,
  ) {
    super({
      clientID: config.get('GITHUB_CLIENT_ID'),
      clientSecret: config.get('GITHUB_CLIENT_SECRET'),
      callbackURL: config.get('GITHUB_CALLBACK_URL'),
      proxy: true,
      scope: ['user:email'],
      // scope: ['email', 'profile'],
    });
  }
  async validate(profile: any): Promise<any> {
    try {
      if (!profile) {
        throw new InternalServerErrorException('Profile is undefined');
      }

      const { displayName, emails, photos, id } = profile;

      if (!emails || !emails.length) {
        throw new NotFoundException('Email not found in Google profile');
      }

      const email = emails[0]?.value;
      if (!email) {
        throw new NotFoundException('Email value is empty');
      }

      const user = await this.authRepository.findByEmail(email);
      if (user?.blocked) {
        throw new BadRequestException('User is blocked');
      }

      if (user) {
        return user;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(id, salt);

      const userData = {
        providerId: id,
        email,
        username: displayName || email.split('@')[0],
        provider: profile.provider || 'github',
        password: hashedPassword,
        avatarUrl: profile._json?.picture || photos?.[0]?.value,
      };

      // console.log('Creating new user:', userData.email);

      const newUser = await this.handleIOauth.createUserViaOauth(userData);

      return {
        id: newUser.id,
        email: emails[0].value,
        username: displayName || email.split('@')[0],
        avatar: photos?.[0]?.value || profile._json?.picture,
        githubId: id,
        // accessToken,
        // refreshToken,
      };
    } catch (error) {
      console.error('Github Strategy Validate Error:', error);
      throw error;
    }
  }
}
