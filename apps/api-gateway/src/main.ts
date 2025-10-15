import { NestFactory } from '@nestjs/core';
import session from 'express-session';
import { ApiGatewayModule } from './api-gateway.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  app.use(cookieParser());

  app.use(
    session({
      secret: process.env.SECRET_SESSION,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 31 * 1000 * 60 * 60 * 24,
      },
    }),
  );
  // app.enableCors({
  //   //   origin: domain,
  //   credentials: true,
  // });

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

  await app.listen(3000);
}
bootstrap();
