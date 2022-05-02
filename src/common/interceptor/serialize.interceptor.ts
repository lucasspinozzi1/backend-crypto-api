import { ServerResponse } from 'http';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
  CustomDecorator,
  SetMetadata,
  PlainLiteralObject
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const CUSTOM_JSON_SERIALIZATION = 'CUSTOM_JSON_SERIALIZATION';
export function CustomJson(): CustomDecorator {
  return SetMetadata(CUSTOM_JSON_SERIALIZATION, true);
}

@Injectable()
export class SerializeInterceptor implements NestInterceptor {

  private readonly logger = new Logger(SerializeInterceptor.name);

  constructor(
    private readonly reflector: Reflector
  ) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.logger.debug('context intercept start');
    const customJsonSerialization = this.reflector.get<boolean>(
      CUSTOM_JSON_SERIALIZATION,
      context.getHandler()
    );
    const stream = next.handle();
    if(!customJsonSerialization){
      return stream;
    }
    if(context.getType() === 'http'){
      const response: ServerResponse = context.switchToHttp().getResponse();
      response.setHeader('Content-type', 'application/json');
    }
    return stream.pipe(
      map((res: PlainLiteralObject | Array<PlainLiteralObject>) =>
        JSON.stringify(
          res,
          function(this: Record<string, any>, k: string, v) {
            if (this[k] instanceof Date) {
              return ['$date', +this[k]];
            }
            return v;
          }
        )
      )
    );
  }
}
