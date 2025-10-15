import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { MongodbModule } from './mongodb-database/monodb.module';
import { ConfigModule } from '@nestjs/config';
import { PostgresModule } from './postgresql-database/postgres.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  providers: [CommonService],
  exports: [CommonService],
  imports: [
    ConfigModule,
    //MongodbModule,
    PostgresModule,
    CloudinaryModule,
  ],
})
export class CommonModule {}
