import { IncomingMessage } from 'http';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {

  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if(context.getType() === 'http'){
      const httpContext: HttpArgumentsHost = context.switchToHttp();
      const request = httpContext.getRequest<IncomingMessage>();
      this.logger.log({
        remoteAddress: request.connection.remoteAddress
      });
    }

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => {
          return this.logger.log({
            status: 'ok',
            duration:`${Date.now() - now}`,
            in: 'ms'
          });
        })
      )
      .pipe(
        catchError((err) => {
          this.logger.log({
            status: 'fail',
            duration:`${Date.now() - now}`,
            in: 'ms'
          });
          return throwError(err);
        })
      );
  }
}
