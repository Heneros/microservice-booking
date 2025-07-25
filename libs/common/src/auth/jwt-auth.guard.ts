import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { AUTH_CONTROLLER } from "../data/sites";
import { ClientProxy } from "@nestjs/microservices";
import { catchError, map, Observable,  of,  tap } from "rxjs";


@Injectable()
export class JWTAuthGuard implements CanActivate{
    constructor(@Inject('AUTH') private readonly authClient: ClientProxy){ }

    
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
//        const request = context.switchToHttp().getRequest();
// const authHeader = request.headers['authorization'];

// if (!authHeader || !authHeader.startsWith('Bearer ')) {
//   return false;
// }

// const token = authHeader.split(' ')[1];
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }
    const token = authHeader.slice(7);

// console.log('tokentoken', token)
            return this.authClient.send('authenticate',  token).pipe(
                tap((user) =>{
                   req.user = user;
                  // context.switchToHttp().getRequest().user = res;
                }),
                map(() => true),
                        catchError((err) => {
          console.error('err123', err);
          return of(false);
        }),
            )
    }

}




