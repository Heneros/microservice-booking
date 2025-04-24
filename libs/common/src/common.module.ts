import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { MongodbModule } from './mongodb-database/monodb.module';
import { ConfigModule } from './config/config.module';
import { PostgresModule } from './postgresql-database/prisma.module';

@Module({
  providers: [CommonService],
  exports: [CommonService],
  imports: [MongodbModule, PostgresModule, ConfigModule],
})
export class CommonModule {}
