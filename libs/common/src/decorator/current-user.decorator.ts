import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    //const authHeader = request.headers.authorization;
    // const token = authHeader?.split('Bearer ')[1];

    // const payload = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    return request.user as User;
  },
);
