import { AbstractRepositoryPostgres, PrismaService } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AuthEntity } from '../entities/Auth.entity';

@Injectable()
export class AuthRepository extends AbstractRepositoryPostgres<AuthEntity> {
  protected readonly logger = new Logger(AuthRepository.name);
  protected readonly prisma: PrismaClient;
  protected readonly model: any;
  constructor(private readonly prismaService: PrismaService) {
    super();
    this.prisma = prismaService;
    this.model = this.prismaService.user;
    this.model = this.prismaService.verifyResetToken;
  }
}
