import { UserEntity, UserJwt } from '@app/common';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export class VerifyJWTService {
  constructor(private readonly jwtService: JwtService) {}

  async verifyJwt(jwt: string): Promise<{ user: UserEntity; exp: number }> {
    if (!jwt) {
      throw new UnauthorizedException();
    }
    console.log('jwtjwtjwt', jwt);
    try {
      const { user, exp } = await this.jwtService.verifyAsync(jwt);
      console.log('user', user);
      return { user, exp };
    } catch (error) {
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
