import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { RMQModule } from 'nestjs-rmq';
import { ApiController } from './api.controller';
import { getRMQConfig } from './configs/rmq.config';
import { FilesService } from './files.service';
import { path } from 'app-root-path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    RMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return getRMQConfig(configService);
      },
    }),

    ServeStaticModule.forRoot({
      rootPath: `${path}/uploads`,
      serveRoot: '/uploads',
    }),
  ],
  controllers: [ApiController],
  providers: [FilesService],
})
export class ApiModule {}
