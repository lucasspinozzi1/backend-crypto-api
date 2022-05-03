import { exist } from 'common/util';

export class Exception extends Error {

  response: Record<string, unknown>;

  constructor(
    response: Record<string, unknown> | string
  ){
    super();
    this.initialize(response);
  }

  private initialize(response: string | Record<string, unknown>) {
    if (typeof response === 'object') {
      this.response = response;
      if (typeof response.message === 'string') {
        this.message = response.message;
      }
    }
    else if (typeof response === 'string') {
      this.message = response;
    }
    else if (exist(this.constructor)) {
      this.message = this.constructor.name;
    }
  }
}
