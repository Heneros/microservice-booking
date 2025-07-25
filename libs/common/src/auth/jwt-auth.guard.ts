import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { AUTH_CONTROLLER } from "../data/sites";
import { ClientProxy } from "@nestjs/microservices";
import { catchError, map, Observable,  of,  tap } from "rxjs";


@Injectable()
export class JWTAuthGuard implements CanActivate{
    constructor(@Inject('AUTH') private readonly authClient: ClientProxy){ }

    
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
<<<<<<< HEAD
   const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No authorization header or invalid format');
      return false;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      console.log('No token found in authorization header');
      return false;
    }

    console.log('JWT received:', token);



      return this.authClient
      .send('authenticate', { jwt: token })
      .pipe(

        tap((response) => {
          console.log('Auth service response:', response);
        }),
        map((response: any) => {
          if (!response) {
            console.error('No response from auth service');
            return false;
          }

          if (response.status === 'success' && response.data) {
          
            request.user = response.data;
            console.log('User authenticated:', response.data.userId);
            return true;
          } else {
            console.error('Authentication failed:', response.message);
            return false;
          }
        }),
        catchError((error) => {
          console.error('Auth service error:', error.message || error);
          return of(false);
        }),
      );

    }


=======
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

>>>>>>> a0efbcbaca2620cbc83f4aa753ae2f8f3b001353
}




