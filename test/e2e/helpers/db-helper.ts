import { PrismaService } from '@app/common';

export async function clearDatabase(prisma: PrismaService) {
  try {
    await prisma.verifyResetToken.deleteMany();
    await prisma.avatar.deleteMany();
    await prisma.user.deleteMany();
  } catch (error) {
    console.error('Error in clearDatabase:', error);
    throw error;
  }
}
