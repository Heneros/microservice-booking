import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class RmqService {
  constructor(private readonly configService: ConfigService) {}

  ack(context: RmqContext) {
    const ch = context.getChannelRef();
    const msg = context.getMessage();
      const deliveryTag = msg?.fields?.deliveryTag;
    //if (msg?.fields?.deliveryTag) ch.ack(msg);
    if(!ch || !msg || !deliveryTag ){
      return 
    }
    ch.ack(msg);
  }

  nack(context: RmqContext, requeue = true): void {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      channel.nack(message, false, requeue);
      console.log(`Message nack: ${message.content.toString()}`);
    } catch (error) {
      console.log(`nack failed: ${error.message}`, error.stack);
      throw error;
    }
  }
}
