import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export class BufferMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req['file']) {
      req['file'].buffer = req['file'].buffer || req['file'].buffer;
    }
    next();
  }
}