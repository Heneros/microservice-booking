// import { Injectable } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
// import { PassportStrategy } from "@nestjs/passport";
// import { ExtractJwt, Strategy } from "passport-jwt";
// import { AuthService } from "../auth.service";


// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy){
// constructor(    configService: ConfigService,
//     private readonly authService: AuthService,
// ){
//     {
//    super({
//             jwtFromRequest: ExtractJwt.fromExtractors([
//                 (req: any) => req?.cookies?.Authentication || req?.Authentication,
//             ]),
//             secretOrKey: configService.get('JWT_SECRET')
//         })
//     }

// }
// async validate({}){

// }
// }






