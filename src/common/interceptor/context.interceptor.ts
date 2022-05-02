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
    this.contextService.initAsyncStack();
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
          const pwd = process.cwd();
          this.logger.debug('context intercept end');
          this.contextService.clearContext();
          this.logger.error({
            message: 'async-stack',
            stack: this.contextService.getAsyncStack()
              .filter((frame)=>{
                return typeof frame != 'undefined' &&
                  frame.fileName.indexOf(pwd) === 0;
              })
              .map((frame)=>{
                const relativePath = frame.fileName.substring(pwd.length);
                const functionName = typeof frame.functionName != 'undefined' ?
                  `(${frame.functionName})` :
                  '';
                return `${relativePath}:${frame.lineNumber}${functionName}`;
              })
          });
          return throwError(err);
        })
      );
  }
}
