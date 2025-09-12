import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    // constructor()
    // {}
}
