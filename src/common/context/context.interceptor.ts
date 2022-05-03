import {
  CallHandler, ExecutionContext, Injectable, Logger,
  NestInterceptor
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ContextService } from './context.service';

@Injectable()
export class ContextInterceptor implements NestInterceptor {

  private readonly logger = new Logger(ContextInterceptor.name);

  constructor(
    private readonly contextService: ContextService
  ){ }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.logger.debug('context intercept start');
    this.contextService.setContext(context);
    return next
      .handle()
      .pipe(
        tap(() => {
          this.logger.debug('context intercept end');
          this.contextService.clearContext();
        })
      )
      .pipe(
        catchError((err) => {
          this.logger.debug('context intercept end');
          this.contextService.clearContext();
          return throwError(err);
        })
      );
  }
}
