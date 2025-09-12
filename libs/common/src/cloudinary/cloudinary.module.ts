import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';
import { AvatarRepository } from '../repository';
import { PostgresModule } from '../postgresql-database';

@Module({
  imports: [PostgresModule],
  providers: [CloudinaryProvider, CloudinaryService, AvatarRepository],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
