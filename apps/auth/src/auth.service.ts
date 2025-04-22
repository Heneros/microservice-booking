import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto';

@Injectable()
export class AuthService {
  async registerUser(request: RegisterUserDto) {}
}
