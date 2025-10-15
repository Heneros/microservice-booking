import { Request } from 'express';
import type { Session } from 'express-session';

export interface CustomRequest extends Request {
  cookies: { [key: string]: string };
  user?: any;
  session: Session;
}
