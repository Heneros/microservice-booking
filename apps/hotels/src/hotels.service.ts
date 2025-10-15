import { Injectable } from '@nestjs/common';

@Injectable()
export class HotelsService {
  getHello(): string {
    return 'Hello World!';
  }
}
