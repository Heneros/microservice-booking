import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqService } from '@app/common';
import { RmqOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const rmqService = app.get<RmqService>(RmqService);

  app.connectMicroservice<RmqOptions>(rmqService.getOptions('AUTH'));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // const configService = app.get(ConfigService);
  await app.startAllMicroservices();
  await app.init();
}
bootstrap();
