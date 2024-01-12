import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { BufferMiddleware } from './image/buffer/buffer.middleware';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "http://localhost:3000",
    credentials: true,
  });
  app.use(cookieParser());
  app.use(new BufferMiddleware().use);
  app.use('/uploads', express.static('uploads'))

  await app.listen(4000);
}
bootstrap();
