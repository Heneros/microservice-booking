import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { domain, RmqService } from '@app/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  app.use(cookieParser());

  app.enableCors({
    origin: domain,
    credentials: true,
  });

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

  const config = new DocumentBuilder()
    .setTitle('Booking App')
    .setDescription('Microservice app build on Nest.js')
    .setVersion('1.0')
    .addTag(
      'Auth',
      'Registration for became a user. Login, Reset password, verify email',
    )
    .addTag(
      'Users',
      'Only available for authorized user or admin role. Actions: remove user, deactivate user, delete my account, change profile data, get all users',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'cookie',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      security: [
        {
          'access-token': [],
          'cookie-auth': [],
        },
      ],
    },
  });

  const rmqService = app.get(RmqService);
  app.connectMicroservice(rmqService.getOptions('AUTH'));
  app.connectMicroservice(rmqService.getOptions('USERS'));

  await app.startAllMicroservices();

  // app.useGlobalInterceptors(app.get(UserInterceptor));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
