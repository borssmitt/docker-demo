import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RMQService } from './rmq.service';

@Module({
  imports: [ConfigModule],
  providers: [RMQService],
  exports: [RMQService],
})
export class RMQModule {}
