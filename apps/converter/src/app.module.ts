import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { GenerateService } from './generate.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/converter/.env',
    }),
  ],
  controllers: [AppController],
  providers: [GenerateService],
})
export class AppModule {}

