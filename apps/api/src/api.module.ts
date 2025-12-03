import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ApiController } from './api.controller';
import { FilesService } from './files.service';
import { path } from 'app-root-path';

// Новый RMQ модуль (наш собственный)
import { RMQModule } from './rmq/rmq.module';

@Module({
  imports: [
    // Глобальная загрузка переменных из /opt/app/.env (в контейнере)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '/opt/app/.env',
    }),

    // Наш собственный RMQ модуль
    RMQModule,

    // Для статики — отдаёт /uploads по /uploads/*
    ServeStaticModule.forRoot({
      rootPath: `${path}/uploads`,
      serveRoot: '/uploads',
    }),
  ],

  controllers: [ApiController],
  providers: [FilesService],
})
export class ApiModule {}
