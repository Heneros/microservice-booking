import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GoogleService } from './services/Google.service';
import { GoogleStrategy } from './passport/GoogleStrategy';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
