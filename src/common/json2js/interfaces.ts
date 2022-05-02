import { Type } from '@nestjs/common';
import { DATETIME } from './types';

export interface Mapper<T> {
  map(source: any, cache: Map<any, any>): T;
}

export type NestedArray<T> = T | Array<NestedArray<T>>;

export interface PropertyNameOptions {
  key: string;
  type: Type;
  position?: number;
  name?: string;
  dateFormat?: DATETIME | string;
}
