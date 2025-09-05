import {
  BadRequestException,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { PrismaService } from '../postgresql-database/postgres.service';
// import { AuthRepository } from '../repository';

@Injectable()
export class EmailValidationPipe implements PipeTransform {
  constructor(
    private prisma: PrismaService,
    // private authRepository: AuthRepository,
  ) {}
  async transform(value: { email: string }) {
    if (!value.email) {
      throw new BadRequestException('Either email must be provided');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        email: value.email,
      },
    });

    if (!user) {
      throw new NotFoundException('No user exists with this email');
    }

    if (!user.isEmailVerified) {
      throw new BadRequestException('Email not verified');
    }

    if (user.blocked) {
      throw new BadRequestException('User is blocked');
    }
    return value;
  }
}
