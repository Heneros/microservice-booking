// import { AbstractRepositoryPostgres, PrismaService } from '@/app/common';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient, Avatar } from '@prisma/client';
import { AbstractRepositoryPostgres } from '../postgresql-database/abstract.repository';
import { PrismaService } from '../postgresql-database/postgres.service';
@Injectable()
export class AvatarRepository extends AbstractRepositoryPostgres<Avatar> {
  protected readonly prisma: PrismaClient;
  protected readonly model: any;

  public readonly avatarModel;

  constructor(private readonly prismaService: PrismaService) {
    super();
    this.prisma = prismaService;
    this.model = this.prisma.avatar;
    this.avatarModel = this.prismaService;
  }

  async findUnique(userId: number) {
    return this.model.findUnique(userId);
  }
}
