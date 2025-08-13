import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class RmqService {
  constructor(private readonly configService: ConfigService) {
    console.log('RABBIT_MQ_URI:', configService.get('RABBIT_MQ_URI'));
    console.log('AUTH_QUEUE:', configService.get('RABBIT_MQ_AUTH_QUEUE'));
  }

  getOptions(queue: string, noAck = false): RmqOptions {
    const uri = this.configService.get<string>('RABBIT_MQ_URI');
    const envKey = `RABBIT_MQ_${queue}_QUEUE`;
    const q = this.configService.get<string>(envKey);
    console.log(
      `[RmqService] getOptions name=${queue} envKey=${envKey} uri=${uri} queue=${q}`,
    );
    if (!uri) throw new Error('RABBIT_MQ_URI не задан');
    if (!q) throw new Error(`${envKey} не задан`);
    return {
      transport: Transport.RMQ,
      options: {
        urls: [uri],
        queue: q,
        noAck,
        persistent: true,
        queueOptions: { durable: true, prefetchCount: 5 },
      },
    };
  }

  ack(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }
}
