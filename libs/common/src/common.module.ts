import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { MongodbModule } from './mongodb-database/monodb.module';
import { ConfigModule } from '@nestjs/config';
import { PostgresModule } from './postgresql-database/prisma.module';

@Module({
  providers: [CommonService],
  exports: [CommonService],
  imports: [
    ConfigModule.forRoot({}),
    //MongodbModule,
    PostgresModule,
  ],
})
export class CommonModule {}
