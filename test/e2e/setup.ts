import {
  ClassSerializerInterceptor,
  INestApplication,
  INestMicroservice,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import dotenv from 'dotenv';
import path, { resolve } from 'path';

import { ApiGatewayModule } from '@/api-gateway/api-gateway.module';

import { PostgresModule, PrismaService } from '@/app/common';

import { APP_INTERCEPTOR } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { clearDatabase } from './helpers/db-helper';

export let app: INestApplication;
export let authMicroservice: INestMicroservice;
export let prisma: PrismaService;

dotenv.config({
  path: path.resolve(process.cwd(), 'apps/api-gateway/.env.test'),
});
process.env.DATABASE_URL =
  'postgresql://postgres:postgres@localhost:5432/testDB?schema=public';
process.env.NODE_ENV = 'test';
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

  await app.init();

  authMicroservice = moduleFixture.createNestMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@localhost:5672'],
      queue: 'auth_queue',
      queueOptions: { durable: false },
      prefetchCount: 5,
      noAck: true,
    },
  });

  await authMicroservice.listen();

  try {
    prisma = app.get(PrismaService);
    await clearDatabase(prisma);
  } catch (error) {
    console.warn('clearDatabase in beforeAll failed:', error);
  }
}, 180000);

afterAll(async () => {
  await authMicroservice.close();
  await app.close();
});
