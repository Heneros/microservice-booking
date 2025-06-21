import { UserEntity, UserJwt } from '@app/common';
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

    const secret = this.configService.get<string>('JWT_SECRET')?.trim();

    try {
      // const decoded = await this.jwtService.verify(jwt, { secret });
      const decoded = await this.jwtService.verifyAsync<{
        userId: number;
        roles: string[];
        exp: number;
      }>(jwt, {
        secret,
        clockTolerance: 30,
        ignoreExpiration: false,
      });

      console.log('JWT successfully decoded:', {
        userId: decoded.userId,
        exp: decoded.exp,
        roles: decoded.roles,
      });

      if (!decoded.userId || !decoded.exp) {
        throw new UnauthorizedException('Invalid JWT payload');
      }

      return decoded;
    } catch (error) {
      console.error('JWT decode error:', error.message);
      console.error('JWT being verified:', jwt);
      throw new UnauthorizedException('Invalid token');
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
