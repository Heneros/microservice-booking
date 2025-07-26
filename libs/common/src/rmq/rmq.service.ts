import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class RmqService {
  constructor(private readonly configService: ConfigService) {}

  getOptions(queue: string, noAck = false): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.get<string>('RABBIT_MQ_URI')],
        queue: this.configService.get<string>(`RABBIT_MQ_${queue}_QUEUE`),
        noAck,
        queueOptions: {
          durable: true,
        },
        prefetchCount: 1,
        socketOptions: {
          heartbeatIntervalInSeconds: 60,
          reconnectTimeInSeconds: 5,
        },
      },
    };
  }

  ack(context: RmqContext) {
    // try {
      const channel = context.getChannelRef();
      const originalMessage = context.getMessage();
        channel.ack(originalMessage);
    //   if (channel && originalMessage) {

    //     console.log('Message acknowledged successfully');
    //   } else {
    //     console.warn('Cannot acknowledge message: missing channel or message');
    //   }
    // } catch (error) {
    //   console.error('Error acknowledging message:', error.message);
    // }
  // }
}
}

