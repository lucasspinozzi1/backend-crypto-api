import { Injectable, Type, Logger } from '@nestjs/common';
import { choose, exist, chooseArray } from 'common/util';
import { OMNI_JSON_2_JS, JsonStrategy, NestedArrayType } from './decorators';
import { PropertyNameOptions, Mapper, NestedArray } from './interfaces';
import { StubMap } from './stub-map';
import { DateMapper } from './date-mapper';

@Injectable()
export class Json2Js {

  private static readonly stubMap: Map<any, any> = new StubMap();

  private readonly logger = new Logger(Json2Js.name);

  private readonly dateMapper = new DateMapper();

  private readonly mappers: Map<Type, Mapper<any>> = new Map();

  /**
   * This component allow converting raw objects from HTTP interface o DB
   * repository to Nodejs (+Typescript) objects
   * Use [Json2JsProperty]{@link ./decorators.ts#Json2JsProperty} and
   * [Json2JsStrategy]{@link ./decorators.ts#Json2JsStrategy} to add
   * corresponding metadata
   * Json2Js is able to detect 'Maximum call stack size exceeded'
   * in order to use a cache to resolve circular o graph references
   * but using this cache is not free. This mechanism penalize performance
   * in a middle point, it is posible to configure part of the
   * schema as recursive. To do that,
   * see [Json2JsStrategy]{@link ./decorators.ts#Json2JsStrategy}
   */
  map<T>(
    source: any,
    type: NestedArrayType<T>,
    graph?: boolean
  ): NestedArray<T> {
    const cache = graph ? new Map() : Json2Js.stubMap;
    try {
      return this.mapInternal(source, type, cache);
    }
    catch (e) {
      if (e.name === 'RangeError' && e.message === 'Maximum call stack size exceeded') {
        this.logger.warn(`'Maximum call stack size exceeded' detected, 
          swtching to graph mode, consider use Json2JsStrategy({graph: true})
          to avoid rework`);
        return this.mapInternal(source, type, new Map());
      }
    }
  }

  private mapInternal<T>(
    source: any,
    type: NestedArrayType<T>,
    cache: Map<any, any>,
    property?: PropertyNameOptions
  ): NestedArray<T> {
    if (Array.isArray(type)) {
      if (Array.isArray(source)) {
        return source.map((x) => this.mapInternal(x, type[0], cache));
      }
      return null;
    }
    if (typeof source === 'undefined') {
      return source;
    }
    if (source === null) {
      return null;
    }
    if (type === null) {
      return null;
    }
    if (type.name === 'String') {
      if (typeof source == 'string') {
        return <T><unknown>source;
      }
      return <T><unknown>String(source);
    }
    if (type.name === 'Number') {
      if (typeof source == 'number') {
        return <T><unknown>source;
      }
      return <T><unknown>Number(source);
    }
    if (type.name === 'Boolean') {
      if (typeof source == 'boolean') {
        return <T><unknown>source;
      }
      return <T><unknown>Boolean(source);
    }
    if (type.name === 'Date') {
      if (typeof source == 'string' || typeof source == 'number') {
        return <T><unknown>this.dateMapper.parse(source, property);
      }
      return null;
    }
    if (type.name === 'Object' || type.name === 'Function') {
      return <T>source;
    }
    const mapper: Mapper<T> = this.getMapper(type);
    const result = mapper.map(source, cache);
    return result;
  }

  private attribute(sourceKey: string, property: PropertyNameOptions) {
    return (source: {}, target: {}, cache: Map<any, any>) => {
      if (source.hasOwnProperty(sourceKey)) {
        const value = source[sourceKey];
        target[property.key] = this.mapInternal(value, property.type, cache, property);
      }
    };
  }

  private position(property: PropertyNameOptions) {
    return (source: any, target: {}, cache: Map<any, any>) => {
      if (!Array.isArray(source)) {
        throw new Error(`Array expected trying to map ${property.type.name}:${property.key}`);
      }
      if (source.length > property.position) {
        const value = source[property.position];
        target[property.key] = this.mapInternal(value, property.type, cache, property);
      }
    };
  }

  private kebabCase(sourceKey: string) {
    return sourceKey.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  }

  private snakeCase(sourceKey: string) {
    return sourceKey.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }

  private capitalize(sourceKey: string) {
    return sourceKey.charAt(0).toUpperCase() + sourceKey.slice(1);
  }

  private getMapper<T>(type: Type<T>) {
    let mapper: Mapper<T> = this.mappers.get(type);
    if (exist(mapper)) {
      return mapper;
    }
    const metadata = Reflect.getMetadata(
      OMNI_JSON_2_JS,
      type.prototype
    );
    const strategy: JsonStrategy = choose(metadata.strategy, JsonStrategy.CLONE);
    const properties: Array<PropertyNameOptions> = chooseArray(metadata.properties, []);
    const pieces = properties.map((property) => {
      if (exist(property.name)) {
        return this.attribute(property.name, property);
      }
      if (strategy === JsonStrategy.CAPITALIZE) {
        return this.attribute(this.capitalize(property.key), property);
      }
      if (strategy === JsonStrategy.SNAKE_CASE) {
        return this.attribute(this.snakeCase(property.key), property);
      }
      if (strategy === JsonStrategy.KEBAB_CASE) {
        return this.attribute(this.kebabCase(property.key), property);
      }
      if (strategy === JsonStrategy.POSITION) {
        if (!exist(property.position)) {
          throw new Error(`position expected in @Json2JsProperty at ${type.name}:${property.key}`);
        }
        return this.position(property);
      }
      // JsonStrategy.CLONE
      return this.attribute(property.key, property);
    });
    mapper = {
      map(source: any, cache: Map<any, any>): T {
        if ((metadata.graph === true) && (cache as StubMap<any, any>).isStub) {
          cache = new Map();
        }
        if (cache.has(source)) {
          return cache.get(source);
        }
        const result = new type();
        cache.set(source, result);
        for (const piece of pieces) {
          piece(source, result, cache);
        }
        return result;
      }
    };
    this.mappers.set(type, mapper);
    return mapper;
  }

}
