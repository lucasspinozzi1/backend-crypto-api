import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ContextMiddleware implements NestMiddleware {

  private readonly logger = new Logger(ContextMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.debug('request start');
    const afterResponse = () => {
      if(res.statusCode === 404){
        this.logger.warn({
          message: 'not found',
          url: req.url,
          method: req.method
        });
      }
      res.removeListener('finish', afterResponse);
    };
    res.on('finish', afterResponse);
    next();
  }

}
