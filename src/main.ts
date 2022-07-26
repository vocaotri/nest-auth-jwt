import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true
  });
  // { allow for some domains
  //   origin: process.env.URL_CORS,
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  // }
  app.useStaticAssets(join(__dirname, '..', 'public'));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(process.env.PORT || 3000, process.env.HOST || '127.0.0.1');
}
bootstrap();
