import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { AUTH_SERVICE } from '../data/microservice-constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject('AUTH') private readonly authService: ClientProxy) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'http') {
      return false;
    }

    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers?.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header');
    }
    const jwt = token.trim();
    // console.log('jwt', jwt);

    return this.authService
      .send<{
        status: string;
        data?: { userId: number; roles: string[]; exp: number };
        message?: string;
      }>({ cmd: AUTH_SERVICE.VERIFY_JWT }, jwt)
      .pipe(
        switchMap((resp) => {
          if (resp.status === 'error') {
            throw new UnauthorizedException(resp.message);
          }
          if (resp.status === 'success' && resp.data) {
            const { userId, roles, exp } = resp.data;

            if (!userId) {
              throw new UnauthorizedException('Invalid token payload');
            }

            request.user = { userId, roles, exp };

            return of(true);
          }

        }),
        catchError((e) =>
          throwError(() => new UnauthorizedException(e.message)),
        ),
      );
  }
}
