import { PropertyNameOptions } from './interfaces';
import { DATETIME } from './types';

export class DateMapper{

  toJson(source: Date, property?: PropertyNameOptions): string | number{
    switch(property?.dateFormat){
      case DATETIME.JSON:{
        return Math.floor(source.getTime() / 1000);
      }
      case DATETIME.UNIX:{
        return source.getTime();
      }
      case DATETIME.ISO_8601:{
        return source.toISOString();
      }
      case DATETIME.RFC_7231:{
        return source.toUTCString();
      }
      default:{
        // TODO implements momentjs template
      }
    }
    return source.toString();
  }

  parse(source: string | number, property?: PropertyNameOptions): Date{
    switch(property?.dateFormat){
      case DATETIME.JSON:{
        return new Date(typeof source === 'string' ? parseInt(source)*1000 : source*1000);
      }
      case DATETIME.UNIX:{
        return new Date(typeof source === 'string' ? parseInt(source) : source);
      }
      case DATETIME.ISO_8601:{
        break;
      }
      case DATETIME.RFC_7231:{
        break;
      }
      default:{
        // TODO implements momentjs template
      }
    }
    return new Date(source);
  }

}
