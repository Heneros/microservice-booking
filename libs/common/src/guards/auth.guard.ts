import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, Observable, of, switchMap } from 'rxjs';
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

    const authHeader = request.headers['authorization'];

    if (!authHeader) return false;

    const authHeaderParts = (authHeader as string).split(' ');

    if (authHeaderParts.length !== 2) return false;

    const [, jwt] = authHeaderParts;

    return this.authService
      .send({ cmd: AUTH_SERVICE.VERIFY_JWT }, { jwt })
      .pipe(
        switchMap(({ exp }) => {
          if (!exp) return of(false);

          const isJwtValid = Date.now() < exp * 1000;
          console.log(isJwtValid);
          return of(isJwtValid);
        }),
        catchError(() => {
          throw new UnauthorizedException();
        }),
      );
  }
}
