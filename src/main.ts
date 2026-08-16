import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import helmet from 'helmet';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.use(helmet({ contentSecurityPolicy: false }));
  app.useStaticAssets(join(process.cwd(), 'public'));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors({ origin: '*', credentials: true });

  const port = process.env.PORT || 8000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Frontend Web UI available at: http://localhost:${port}/`);
}
bootstrap();