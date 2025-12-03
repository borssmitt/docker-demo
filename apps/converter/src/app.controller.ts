import { Controller, Logger, Post, Body } from '@nestjs/common';
import { GenerateImages, ImageRequirement, ImageResult } from '../../../contracts/converter';
import { GenerateService } from './generate.service';
import { performance } from 'perf_hooks';

/**
 * Теперь контроллер работает по HTTP,
 * вместо RMQRoute добавлен обычный POST route.
 */

@Controller()
export class AppController {
  private static instance: number =
    Math.floor(Math.random() * (999 - 100 + 1)) + 100;

  constructor(private readonly generateService: GenerateService) {}

  @Post('generate') // <-- Было RMQRoute, теперь HTTP
  async generateImage(
    @Body() { image, requirements, options }: GenerateImages.Request,
  ): Promise<GenerateImages.Response> {
    const jobNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    Logger.log(`[${AppController.instance}][${jobNumber}] Start generate...`);
    const t0 = performance.now();

    try {
      const bufferImage = Buffer.from(image, 'base64');

      // 1. Преобразуем оригинал
      const transformedImage = await this.generateService.transformOriginal(
        bufferImage,
        options,
      );

      // 2. Генерируем нужные размеры
      const images = await Promise.all(
        requirements.map(
          async (requirement: ImageRequirement): Promise<ImageResult> =>
            this.generateService.generateSizes(
              Buffer.from(transformedImage.image),
              requirement,
              options,
            ),
        ),
      );

      return { images: images.concat([transformedImage]) };
    } catch (error) {
      Logger.error(error);
      throw error;
    } finally {
      const t1 = performance.now();
      Logger.log(
        `[${AppController.instance}][${jobNumber}] Generation completed in ${
          t1 - t0
        } ms`,
      );
    }
  }
}
