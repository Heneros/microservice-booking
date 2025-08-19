import { UserEntity, UserJwt } from '@/app/common';
import * as jsonWeb from 'jsonwebtoken';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class VerifyJWTService {
  constructor(
    private configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async verifyJwt(
    jwt: string,
  ): Promise<{ userId: number; roles: string[]; exp: number }> {
    if (!jwt) {
      throw new UnauthorizedException();
    }
    let secret = this.configService.get('JWT_SECRET');
    try {
      const decoded = await this.jwtService.verify(jwt, {
        secret,
      });
      // const decoded = jsonWeb.verify(secret, process.env.JWT_SECRET) as any;

      // console.log('Decoded JWT:', decoded);

      if (!decoded.userId || !decoded.exp) {
        throw new UnauthorizedException('Invalid JWT payload');
      }
      // console.log('decoded000', decoded);
      // console.log('decoded', decoded.id);

      return {
        // username: decoded.username,
        userId: decoded.userId,
        roles: decoded.roles,
        exp: decoded.exp,
      };
    } catch (error) {
      console.error('JWT decode error:', error.message);
      throw new UnauthorizedException();
    }
  }

  async getUserFromHeader(jwt: string): Promise<UserJwt> {
    if (!jwt) return;

    try {
      return this.jwtService.decode(jwt) as UserJwt;
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
