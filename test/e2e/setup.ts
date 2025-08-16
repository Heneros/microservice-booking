import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { config } from 'dotenv';

import { ApiGatewayModule } from '@api-gateway/api-gateway.module';

import { PostgresModule } from '@/libs/common/src';
import { APP_INTERCEPTOR } from '@nestjs/core';

export let app: INestApplication;

config({ path: '.env.test' });

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [ApiGatewayModule, PostgresModule],

    providers: [
      {
        provide: APP_INTERCEPTOR,
        useClass: ClassSerializerInterceptor,
      },
    ],
  }).compile();

  app = moduleFixture.createNestApplication();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
});

afterAll(async () => {});
