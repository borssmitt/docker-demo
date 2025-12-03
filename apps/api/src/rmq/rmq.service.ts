import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AmqpConnectionManager, ChannelWrapper, connect } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';

@Injectable()
export class RMQService implements OnModuleInit {
  private connection: AmqpConnectionManager;
  private channel: ChannelWrapper;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    const user = this.config.get('AMQP_USER');
    const pass = this.config.get('AMQP_PASSWORD');
    const host = this.config.get('AMQP_HOSTNAME');
    const exchange = this.config.get('AMQP_EXCHANGE');

    const uri = `amqp://${user}:${pass}@${host}:5672`;

    this.connection = connect([uri]);

    this.connection.on('connect', () => {
      console.log('✔ RMQ connected');
    });

    this.connection.on('disconnect', err => {
      console.error('✖ RMQ disconnected', err.err);
    });

    this.channel = this.connection.createChannel({
      json: true,
      setup: async (channel: ConfirmChannel) => {
        await channel.assertExchange(exchange, 'topic', { durable: true });
      },
    });
  }

  async publish(routingKey: string, message: any) {
    const exchange = this.config.get('AMQP_EXCHANGE');
    await this.channel.publish(exchange, routingKey, message);
  }
}
