// istanbul ignore file
// WHY?: Nothing to test.

import { Logger } from "@nestjs/common";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export enum responseCode {
    UNCAUGHT_EXCEPTION = 'UNCAUGHT_EXCEPTION',
    INVALID_BODY = 'INVALID_BODY',
    NOT_FOUND = 'NOT_FOUND',
    UNKNOWN = 'UNKNOWN',
    OK = 'SUCCESS',
    NO_CONTENT = 'NO_CONTENT',
    LOGGED = 'LOGGED',
    USER_NOT_FOUND='USER_NOT_FOUND'
}

const defaultResponses = [
  { code: responseCode.UNCAUGHT_EXCEPTION, statusCode: 500, message: 'Internal Server error', result: null },
  { code: responseCode.INVALID_BODY, statusCode: 400, message: 'Invalid request', result: null },
  { code: responseCode.NOT_FOUND, statusCode: 404, message: '' },
  { code: responseCode.UNKNOWN, statusCode: 401, message: '', result: null },
  { code: responseCode.OK, statusCode: 200, message: 'The request has been successful', result: {} },
  { code: responseCode.NO_CONTENT, statusCode: 200, message: 'There is no content related to your request', result: null },
  { code: responseCode.LOGGED, statusCode: 200, message: 'User logged in' },
  { code: responseCode.USER_NOT_FOUND, statusCode: 404, message: 'The User doesnt exist' },


];

export interface IResponseController {
  code: string,
  statusCode: number,
  message: string,
  result?: any
}

export class CodeError extends Error {
  data: unknown;
  constructor(public errorCode: responseCode, data?: unknown, message?: string) {
    super(message);
    this.data = data || null;
  }
}

export class ResponseHandler {
  private logger: Logger;
  private method: string;
  constructor(_logger: Logger, method: string) {
    this.logger = _logger;
    this.method = method;
    this.logger.debug({ method });
  }

  private set<T>( code: string, data?: T): IResponseController {
    const newResponse = defaultResponses.filter(e => e.code === code)[0];
    newResponse.result = data || null;
    return newResponse;
  }

  success<T>(data?: T, code = responseCode.OK): IResponseController {
    this.logger.debug({
      message: 'Response.success',
      method: this.method,
      data,
    });
    return this.set(code, data);
  }

  noContent<T>(data?: T): IResponseController {
    this.logger.log({
      method: this.method,
      message: 'No content response',
      data: data || null,
    });
    return this.set(responseCode.NO_CONTENT, data);
  }

  invalid<T>(data?: T, message?: string): IResponseController {
    const response = this.set(responseCode.INVALID_BODY, data);
    if (message) response.message = message;
    this.logger.log({
      method: this.method,
      data: data || null,
      message: message || null,
    });
    return response;
  }

  error(error: CodeError): IResponseController {
    const response = this.set(error.errorCode || responseCode.UNCAUGHT_EXCEPTION, error.data);
    response.message = error.message || response.message;
    this.logger.error({
      method: this.method,
      message: response.message,
      data: error,
    });
    return response;
  }
}
