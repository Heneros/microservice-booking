import { AbstractRepositoryPostgres, PrismaService } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';

import { AuthEntity } from '@app/common/entities/Auth.entity';

@Injectable()
export class AuthRepository extends AbstractRepositoryPostgres<User> {
  protected readonly logger = new Logger(AuthRepository.name);
  protected readonly prisma: PrismaClient;
  protected readonly model: any;

  public readonly userModel;
  public readonly tokenModel;

  constructor(private readonly prismaService: PrismaService) {
    super();
    this.prisma = prismaService;
    this.model = this.prisma.user;
    this.userModel = this.prismaService.user;
    this.tokenModel = this.prismaService.verifyResetToken;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findUnique({ email });
  }

  async updateProfile(id: number, data): Promise<User | null> {
    return this.update({ id }, data);
  }
}
