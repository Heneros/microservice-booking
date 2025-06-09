import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserInterceptor } from '@app/common';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UserInterceptor],
})
export class UserModule {}
