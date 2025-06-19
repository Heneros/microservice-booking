// import {
//   CallHandler,
//   ExecutionContext,
//   Inject,
//   Injectable,
//   NestInterceptor,
// } from '@nestjs/common';
// import { ClientProxy } from '@nestjs/microservices';

// import { catchError, switchMap } from 'rxjs';
// import { UserJwt } from '../interfaces/user-jwt.interface';
// import { AUTH_SERVICE } from '../data/microservice-constants';

// @Injectable()
// export class UserInterceptor implements NestInterceptor {
//   constructor(@Inject('AUTH') private readonly authService: ClientProxy) {}

//   intercept(ctx: ExecutionContext, next: CallHandler) {
//     // if (ctx.getType() !== 'http') return next.handle();
//     // const request = ctx.switchToHttp().getRequest();
//     // const authHeader = request.headers['authorization'];
//     // console.log('authHeader', authHeader);
//     // if (!authHeader) return next.handle();
//     // const authHeaderParts = authHeader.split(' ');
//     // if (authHeaderParts.length !== 2) return next.handle();
//     // const [, jwt] = authHeaderParts;
//     // // console.log('jwt', jwt);
//     // return this.authService
//     //   .send<UserJwt>(
//     //     {
//     //       cmd: AUTH_SERVICE.DECODE_JWT,
//     //     },
//     //     { jwt },
//     //   )
//     //   .pipe(
//     //     switchMap((response) => {
//     //       // console.log('Auth service response:', response);
//     //       if (response && response.user) {
//     //         request.user = response.user;
//     //       } else if (response) {
//     //         request.user = response;
//     //       } else {
//     //         console.warn('No user data received from auth service');
//     //       }
//     //       return next.handle();
//     //     }),
//     //     catchError((err) => {
//     //       console.error('Interceptor error', err);
//     //       return next.handle();
//     //     }),
//     //   );
//   }
// }
