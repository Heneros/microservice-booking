import { UserEntity } from '@app/common';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export class VerifyJWTService {
  constructor(private readonly jwtService: JwtService) {}

  async verifyJwt(jwt: string): Promise<{ user: UserEntity; exp: number }> {
    if (!jwt) {
      throw new UnauthorizedException();
    }

    try {
      const { user, exp } = await this.jwtService.verifyAsync(jwt);

      return { user, exp };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
