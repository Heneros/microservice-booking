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
  ) {
    if (!jwt) {
      throw new UnauthorizedException('Token is required');
    }

    const secret = this.configService.get('JWT_SECRET')

    try {
      // const tokenParts = jwt.split('.');
      // if (tokenParts.length !== 3) {
      //   throw new Error('Invalid JWT format - wrong number of parts');
      // }

      const decoded = await this.jwtService.verifyAsync<{
        userId: number;
        roles: string[];
        exp: number;
        iat?: number;
      }>(jwt, {
        secret,
        clockTolerance: 30,
        ignoreExpiration: false,
        // algorithms: ['HS256'], 
      });

      if (!decoded.userId || !decoded.exp) {
        throw new UnauthorizedException('Invalid JWT payload');
      }

      // const now = Math.floor(Date.now() / 1000);
      // const timeToExpiry = decoded.exp - now;

      // if (timeToExpiry < 0) {
      //   throw new UnauthorizedException('Token expired');
      // }

      return decoded;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      } else if (error.name === 'JsonWebTokenError') {
        if (error.message === 'invalid signature') {
          throw new UnauthorizedException(
            'Invalid token signature - check JWT_SECRET',
          );
        }
        throw new UnauthorizedException('Invalid token format');
      } else if (error.name === 'NotBeforeError') {
        throw new UnauthorizedException('Token not active yet');
      }

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
