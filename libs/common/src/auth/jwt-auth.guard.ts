import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { catchError, map, Observable, tap } from 'rxjs';


@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject('AUTH') private authClient: ClientProxy) {}

  canActivate(ctx: ExecutionContext): boolean | Observable<boolean> {

    if (ctx.getType() === 'rpc') {
      return true;
    }

    const req = ctx.switchToHttp().getRequest<Request>();
    const token =
      req.cookies?.jwtBooking ||
      this.extractBearerToken(req.headers.authorization);

    if (!token) {
      throw new UnauthorizedException('Authentication token is missing');
    }

    return this.authClient
      .send(
        'validate_user',
        { Authentication: token },
      )
      .pipe(
        tap((user) => {
          req['user'] = user;
        }),
        map(() => true),  
        catchError(() => {
          throw new UnauthorizedException('Invalid or expired token');
        }),
      );
  }

  private extractBearerToken(authHeader?: string): string | null {
    if (!authHeader) return null;
    const [scheme, creds] = authHeader.split(' ');
    return scheme === 'Bearer' ? creds : null;
  }

}