import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ZodValidationPipe } from 'nestjs-zod';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'production';
  let httpsOptions;

  if (isProduction) {
    httpsOptions = {
      key: fs.readFileSync(path.join(__dirname, '..', 'certs', 'key.pem')),
      cert: fs.readFileSync(path.join(__dirname, '..', 'certs', 'cert.pem')),
    };
  }

  const app = await NestFactory.create(AppModule, {
    ...(httpsOptions ? { httpsOptions } : {}),
  });

  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:8080', 'http://localhost:5173'],
    credentials: true,
  });

  app.use(cookieParser());

  // Set global API prefix
  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ZodValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

