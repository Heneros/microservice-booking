// import {
//   CanActivate,
//   ExecutionContext,
//   Inject,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { ClientProxy } from '@nestjs/microservices';
// import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
// import { AUTH_SERVICE } from '../data/microservice-constants';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(@Inject('AUTH') private readonly authService: ClientProxy) {}

//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     if (context.getType() !== 'http') {
//       return false;
//     }

//     const request = context.switchToHttp().getRequest();

//     const authHeader = request.headers?.authorization;

//     if (!authHeader) {
//       throw new UnauthorizedException('No authorization header');
//     }

//     // const authHeaderParts = (authHeader as string).split(' ');

//     // if (authHeaderParts.length !== 2) return false;

//     // const [, jwt] = authHeaderParts;
//     const jwt = authHeader.split('Bearer ')[1];
//     if (!jwt) {
//       throw new UnauthorizedException('No token provided');
//     }

//     // console.log('jwt', jwt);

//     return this.authService
//       .send({ cmd: AUTH_SERVICE.VALIDATE_USER }, { jwt })
//       .pipe(
//         switchMap((response: any) => {
//           if (response?.status === 'error') {
//             throw new UnauthorizedException(response.message);
//           }

//           const { exp } = response;
//           const isJwtValid = Date.now() < exp * 1000;
//           return of(isJwtValid);
//         }),
//         catchError((error) => {
//           console.log('error', error);
//           throw new UnauthorizedException();
//         }),
//       );
//   }
// }
