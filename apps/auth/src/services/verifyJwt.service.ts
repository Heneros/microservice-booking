import { UserEntity, UserJwt } from '@app/common';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class VerifyJWTService {
  constructor(private readonly jwtService: JwtService) {}

  async verifyJwt(
    jwt: string,
  ): Promise<{ userId: number; roles: string[]; exp: number }> {
    if (!jwt) {
      throw new UnauthorizedException();
    }
    // console.log('jwtjwtjwt', jwt);
    try {
      const decoded = await this.jwtService.verifyAsync(jwt, {
        secret: process.env.JWT_SECRET,
      });
      // console.log('Decoded JWT:', decoded);

      if (!decoded.username || !decoded.exp) {
        throw new UnauthorizedException('Invalid JWT payload');
      }
      // console.log('decoded000', decoded);
      // console.log('decoded', decoded.id);

      return {
        // username: decoded.username,
        userId: decoded.id,
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
