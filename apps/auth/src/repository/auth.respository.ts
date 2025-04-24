import { AbstractRepositoryPostgres, PrismaService } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { Auth } from '../schemas/auth.schema';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AuthRepository extends AbstractRepositoryPostgres<Auth> {
  protected readonly logger = new Logger(AuthRepository.name);
  protected readonly prisma: PrismaClient;
  protected readonly model: any;
  constructor(private readonly prismaService: PrismaService) {
    super();
    this.prisma = prismaService;
    this.model = prismaService;
  }
}
