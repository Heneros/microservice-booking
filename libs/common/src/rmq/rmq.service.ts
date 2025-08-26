import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class RmqService {
  constructor(private readonly configService: ConfigService) {}
  
  
  ack(context: RmqContext, allUpTo?: boolean): void {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    
    try {
      if (originalMessage) {
        channel.ack(originalMessage, allUpTo || false);
        console.log('Message acknowledged successfully');
      }
    } catch (error) {
      console.error('Error acknowledging message:', error);
    }
  }

  // ack(context: RmqContext): void {
  //   const channel = context.getChannelRef();
  //   const message = context.getMessage();
  //   try {
  //     channel.ack(message);
  //     console.log(`Message acked: ${message.content.toString()}`);
  //   } catch (error) {
  //     console.log(`Ack failed: ${error.message}`, error.stack);
  //     throw error;
  //   }
  // }

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
