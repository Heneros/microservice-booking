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

  async verifyJwt(jwt: string){
    if (!jwt || typeof jwt !== 'string') {
      throw new UnauthorizedException('Token is required and must be a string');
    }

    const secret = this.configService.get<string>('JWT_SECRET');
    
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    try {
   
      const tokenParts = jwt.split('.');
      if (tokenParts.length !== 3) {
        throw new UnauthorizedException('Invalid JWT format');
      }

    
      const decoded = await this.jwtService.verifyAsync(jwt, {
        secret,
        clockTolerance: 30,
        ignoreExpiration: false,
        algorithms: ['HS256'],
      });

      if (!decoded.userId || !decoded.exp || !decoded.roles) {
        throw new UnauthorizedException('Invalid JWT payload structure');
      }

 
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp <= now) {
        throw new UnauthorizedException('Token expired');
      }

      console.log('JWT successfully verified for user:', decoded.userId);

      return {
        userId: decoded.userId,
        username: decoded.username,
        roles: decoded.roles,
        exp: decoded.exp,
      };
    } catch (error) {
      console.error('JWT verification error:', error.message);

      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      } else if (error.name === 'JsonWebTokenError') {
        if (error.message.includes('invalid signature')) {
          throw new UnauthorizedException('Invalid token signature - check JWT_SECRET');
        }
        throw new UnauthorizedException(`Invalid token: ${error.message}`);
      } else if (error.name === 'NotBeforeError') {
        throw new UnauthorizedException('Token not active yet');
      }

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException('Token verification failed');
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
