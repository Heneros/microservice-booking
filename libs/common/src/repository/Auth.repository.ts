import { AbstractRepositoryPostgres, PrismaService } from '@/app/common';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';

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
  async verifyUser(userId: number) {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        isEmailVerified: true,
      },
    });
    return updatedUser;
  }

  async findById(id: number) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async updatePassword(userId: number, newPassword: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { password: newPassword },
    });
  }
}
