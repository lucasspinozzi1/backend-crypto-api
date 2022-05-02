import { Type, Module } from '@nestjs/common';
import { choose, exist } from 'common/util';
import { DATETIME } from './types';

export const OMNI_JSON_2_JS = 'OMNI_JSON_2_JS';

export enum JsonStrategy {
  KEBAB_CASE,
  SNAKE_CASE,
  CAPITALIZE,
  CLONE,
  POSITION
}

export type NestedArrayType<T = any> = Type<T> | [NestedArrayType<T>];

interface Json2JsPropertyNameOptions {
  name: string;
  type?: Type;
  dateFormat?: DATETIME | string;
};

interface Json2JsPropertyPositionOptions {
  position: string;
  type?: Type;
  dateFormat?: DATETIME | string;
};

interface Json2JsPropertyDateFormatOptions {
  dateFormat: DATETIME | string;
};

interface Json2JsPropertyTypeOptions {
  type: NestedArrayType;
  dateFormat?: DATETIME | string;
};

/**
 * @param name
 * The name with mapper will consume source
 * for example
 * // @Json2JsProperty(my_name)
 * // myName: string
 * or
 * // @Json2JsProperty({
 * //   name: my_name
 * // })
 * // myName: string
 * will consume `source.my_name` and populate `target.myName`
 *
 * @param position
 * The position the mapper will consume source
 * for example
 * // @Json2JsProperty(1)
 * // myName: string
 * or
 * // @Json2JsProperty({
 * //   position: 1
 * // })
 * // myName: string
 * will consume `source[1]` and populate `target.myName`
 *
 * @param type
 * The type the mapper will use to map source value
 * for example
 * // @Json2JsProperty(Number)
 * // myName: string
 * or
 * // @Json2JsProperty({
 * //   type: Number
 * // })
 * // myName: string
 * will consume `source.myName` and populate `target.myName`
 * trying to convert it to number
 * Due typescript do not provide metadata about generics
 * type is required in array values.
 * Type allow nested arrays, so, it is possible use both
 * `[Number]` as `[[Number]]`
 */

export function Json2JsProperty(options: Json2JsPropertyNameOptions): PropertyDecorator;
export function Json2JsProperty(options: Json2JsPropertyPositionOptions): PropertyDecorator;
export function Json2JsProperty(options: Json2JsPropertyTypeOptions): PropertyDecorator;
export function Json2JsProperty(options: Json2JsPropertyDateFormatOptions): PropertyDecorator;
export function Json2JsProperty(name: string): PropertyDecorator;
export function Json2JsProperty(position: number): PropertyDecorator;
export function Json2JsProperty(type: NestedArrayType): PropertyDecorator;
export function Json2JsProperty(): PropertyDecorator;
export function Json2JsProperty(...args: Array<any>): PropertyDecorator  {
  let value = args[0];
  if(!exist(value)){
    value = {};
  }
  if(typeof value === 'number'){
    value = {
      position: value
    };
  }
  if(typeof value === 'string'){
    value = {
      name: value
    };
  }
  if(typeof value === 'function' || Array.isArray(value)){
    value = {
      type: value
    };
  }
  return (
    target: Object,
    propertyKey: string | symbol
  ) => {
    if(/^\s*$/.test(value.name)){
      throw new Error(`empty name is not allowed 
        ${target.constructor.name}:${String(propertyKey)}`);
    }
    if(exist(value.position) && value.position < 0){
      throw new Error(`negative position is not allowed 
        ${target.constructor.name}:${String(propertyKey)}`);
    }
    const current = choose(Reflect.getMetadata(OMNI_JSON_2_JS, target), {});
    if(!exist(current.properties)){
      current.properties = [];
    }
    const type = Reflect.getMetadata('design:type', target, propertyKey);
    if(!exist(value.type)){
      if(Array === type){
        throw new Error(`type required for Json2JsProperty in 
          ${target.constructor.name}:${String(propertyKey)}`);
      }
      value.type = type;
    }
    current.properties.push({
      ...value,
      key: propertyKey
    });
    Reflect.defineMetadata(
      OMNI_JSON_2_JS,
      current,
      target
    );
  };
}

interface Json2JsClassOptions {
  strategy: JsonStrategy;
  graph?: boolean;
};
/**
 *
 * @param strategy
 * default strategy to map atributes
 * KEBAB_CASE: for attribute `myName` will consumes `source.my-name`;
 * SNAKE_CASE: for attribute `myName` will consumes `source.my_name`;
 * PASCAL_CASE: for attribute `myName` will consumes `source.MyName`;
 * CLONE copy attributes with same names
 * POSITION copy values by position, it requires `position`
 * in every @Json2JsProperty
 *
 * @param graph
 * enable reference cache in order to map circular o graph data structures
 * it is important to note it is not free, it penalize performance
 */
export function Json2JsStrategy(options: Json2JsClassOptions): ClassDecorator;
export function Json2JsStrategy(strategy: JsonStrategy): ClassDecorator;
export function Json2JsStrategy(): ClassDecorator;
export function Json2JsStrategy(...args: Array<any>): ClassDecorator  {
  const first = args[0];
  const {
    strategy,
    graph
  } = typeof first === 'object'? first:{ strategy: first, graph: false };
  if(!exist(strategy) && graph !== true){
    return (target) => {
      return target;
    };
  }
  return (target) => {
    const current = choose(Reflect.getMetadata(OMNI_JSON_2_JS, target.prototype), {});
    current.strategy = strategy;
    current.graph = graph;
    Reflect.defineMetadata(
      OMNI_JSON_2_JS,
      current,
      target.prototype
    );
    return target;
  };
}
