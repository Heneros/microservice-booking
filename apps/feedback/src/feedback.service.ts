import { Injectable } from '@nestjs/common';

@Injectable()
export class FeedbackService {
  getHello(): string {
    return 'Hello World!';
  }
}
