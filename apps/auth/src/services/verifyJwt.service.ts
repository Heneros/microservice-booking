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

<<<<<<< HEAD
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
=======
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
>>>>>>> a0efbcbaca2620cbc83f4aa753ae2f8f3b001353
      } else if (error.name === 'NotBeforeError') {
        throw new UnauthorizedException('Token not active yet');
      }

<<<<<<< HEAD
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException('Token verification failed');
=======
      throw new UnauthorizedException('Invalid token');
>>>>>>> a0efbcbaca2620cbc83f4aa753ae2f8f3b001353
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
