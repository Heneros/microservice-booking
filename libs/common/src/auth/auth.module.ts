// import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
// import { RmqModule } from '../rmq/rmq.module';
// import { AUTH_SERVICE } from '../data/microservice-constants';
// import cookieParser from 'cookie-parser';

// @Module({
//   imports: [RmqModule.register({ name: AUTH_SERVICE.AUTH_MAIN })],
//   exports: [RmqModule],
// })
// export class AuthModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(cookieParser()).forRoutes('*');
//   }
// }
