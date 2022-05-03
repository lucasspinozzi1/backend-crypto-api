import {
  Logger,
  HttpException as NestHttpException
} from '@nestjs/common';
import { Exception } from './exception';
import { DEFAULT_ERROR_STATUS_CODE } from '.';

export class HttpException extends Exception {

  private static readonly logger = new Logger(HttpException.name);

  status: number;

  constructor(
    response: Record<string, unknown> | string,
    status: number
  ){
    super(response);
    if(typeof status !== 'number'){
      HttpException.logger.warn('trying to create HttpException with no number status');
      this.status = DEFAULT_ERROR_STATUS_CODE;
    }
    else{
      this.status = status;
    }
  }

  static extends(ex: Error, status: number): HttpException{
    const instance = new HttpException(ex.message, status);
    if(ex instanceof Exception){
      instance.response = ex.response;
    }
    if(ex instanceof NestHttpException){
      const response = ex.getResponse();
      if(typeof response === 'object' && !Array.isArray(response)){
        instance.response = response as Record<string, unknown>;
      }
    }
    instance.stack = ex.stack;
    return instance;
  }

}
