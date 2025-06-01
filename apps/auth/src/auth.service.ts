import { Injectable, UnauthorizedException } from '@nestjs/common';
// import bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto';
import { UserRepository } from '../../../libs/common/src/repository';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async validateUser(email: string, password: string) {
    // const user = await this.userRepository.findOne({ text: email });
    // const passwordIsValid = await bcrypt.compare(password, user.password);
    // if (!passwordIsValid) {
    //   throw new UnauthorizedException('Credentials are not valid.');
    // }
    // return user;
  }

  async login() {}
}
