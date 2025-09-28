import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';

import { ConfigModule } from '@nestjs/config';

import { AuthModule } from 'apps/auth/src/auth.module';

@Module({
  imports: [ConfigModule, , AuthModule],

  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule {}
