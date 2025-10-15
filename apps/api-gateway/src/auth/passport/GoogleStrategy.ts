import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import bcrypt from 'bcrypt';
import { HandleIOAuth } from '../services/HandleOAuth.service';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthRepository } from '@/app/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly config: ConfigService,
    private readonly handleIOauth: HandleIOAuth,
    private readonly authRepository: AuthRepository,
  ) {
    const clientID = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const callbackURL = process.env.GOOGLE_CALLBACK_URL;

    if (!clientID || !clientSecret) {
      throw new Error(
        'GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be defined',
      );
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      proxy: true,
      scope: ['email', 'profile'],
      passReqToCallback: false,
    });

    if (process.env.NODE_ENV === 'test') {
      return;
    }
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
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

      // console.log('Processing user with email:', email);

      const user = await this.authRepository.findByEmail(email);
      if (user?.blocked) {
        throw new BadRequestException('User is blocked');
      }

      if (user) {
        // console.log('Existing user found:', user.id);
        return user;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(id, salt);

      const userData = {
        providerId: id,
        email,
        username: displayName || email.split('@')[0],
        provider: profile.provider || 'google',
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
        googleId: id,
        accessToken,
      };
    } catch (error) {
      console.error('Google Strategy Validate Error:', error);
      throw error;
    }
  }
}
