import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}


  canActivate(context: ExecutionContext) {
    if (context.getType() === 'rpc') {
      return true;
    }   



    const requiredRoles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    // console.log(requiredRoles);


    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    if (context.getType() === 'http') {
      const req = context.switchToHttp().getRequest();
      const user = req?.user;

      // console.log(123);
      if (!user) {
        throw new UnauthorizedException('User not authenticated');
      }

      const userRoles: string[] = Array.isArray(user.roles) ? user.roles : [];

      const hasRole = requiredRoles.some((r) => userRoles.includes(r));

      if (!hasRole) {
        throw new ForbiddenException('Insufficient permissions');
      }

      return true;
    }
    throw new ForbiddenException('RolesGuard supports only HTTP context');
  }
}
