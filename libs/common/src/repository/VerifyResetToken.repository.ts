import { AbstractRepositoryPostgres, PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { PrismaClient, VerifyResetToken } from '@prisma/client';
import { CreateTokenInput } from '@app/common/interfaces/model.interface';
import { tempTokenDate } from '../data/constants';

@Injectable()
export class VerifyResetTokenRepository extends AbstractRepositoryPostgres<VerifyResetToken> {
  protected readonly prisma: PrismaClient;
  protected readonly model: any;

  constructor(private readonly prismaService: PrismaService) {
    super();
    this.prisma = prismaService;
    this.model = this.prisma.verifyResetToken;
  }

  async createToken(data: CreateTokenInput): Promise<VerifyResetToken> {
    return this.model.create({
      data: {
        userId: data.userId,
        token: data.token,
        createdAt: new Date(),
        expiresAt: data.tempDate,
      },
    });
  }

  async findTokenByTokenValue(token: string): Promise<VerifyResetToken | null> {
    return this.model.findUnique({ where: { token } });
  }

  async deleteToken(userId: number): Promise<VerifyResetToken> {
    return this.model.delete({ where: { userId } });
  }

  async updateToken(
    userId: number,
    emailToken: string,
  ): Promise<VerifyResetToken> {
    return this.model.upsert({
      where: { userId },
      update: {
        token: emailToken,
        expiresAt: tempTokenDate,
      },
      create: {
        userId,
        token: emailToken,
        expiresAt: tempTokenDate,
      },
    });
  }
}
