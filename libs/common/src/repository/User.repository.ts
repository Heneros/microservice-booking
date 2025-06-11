import { AbstractRepositoryPostgres, PrismaService } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { AuthEntity } from '../entities/Auth.entity';
import { PAGINATION_LIMIT } from '../../../../apps/auth/src/data/defaultData';

@Injectable()
export class UserRepository extends AbstractRepositoryPostgres<User> {
  protected readonly logger = new Logger(UserRepository.name);
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

  async findAllUser(skip: number): Promise<User[] | null> {
    return await this.prisma.user.findMany({
      skip,
      take: PAGINATION_LIMIT,
    });
  }

  async findById(userId: number): Promise<User | null> {
    return this.findUnique({ id: userId });
  }
}
