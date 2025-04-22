import { Module } from '@nestjs/common';
import { PrismaService } from './postgres.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PostgresModule {}
