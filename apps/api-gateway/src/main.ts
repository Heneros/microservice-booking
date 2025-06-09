import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { RmqService, UserInterceptor } from '@app/common';

// async function bootstrap() {
//   const app = await NestFactory.create(ApiGatewayModule);

//   const rmqService = app.get<RmqService>(RmqService);
//   app.connectMicroservice(rmqService.getOptions('API-GATEWAY'));

//   // await app.startAllMicroservices();
//   app.use(cookieParser());
//   app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
//   await app.startAllMicroservices();
//   await app.listen(process.env.port ?? 3000);
// }
// bootstrap();

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const rmqService = app.get(RmqService);
  app.connectMicroservice(rmqService.getOptions('AUTH'));
  app.connectMicroservice(rmqService.getOptions('USERS'));

  await app.startAllMicroservices();

  // app.useGlobalInterceptors(app.get(UserInterceptor));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
