import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { setupRedoc } from './setup.redoc';

const PORT = process.env.PORT;

const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  // Middleware
  app.enableCors({ credentials: true });
  app.setGlobalPrefix('api');

  // Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .build();

    await setupRedoc(app);

  await app.listen(PORT);

  Logger.log(`🚀 Server is up and running on port ${PORT}!`);
};

bootstrap();
