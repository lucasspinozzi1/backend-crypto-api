import { Type } from '@nestjs/common';
import { chooseArray } from 'common/util';
export const OMNI_PROVIDER = 'OMNI_PROVIDER';
export const OMNI_PROVIDER_CLASSES = 'OMNI_PROVIDER_CLASSES';
export const OMNI_PROVIDER_CUSTOMERS = 'OMNI_PROVIDER_CUSTOMERS';
export const OMNI_DYNAMIC_PROVIDER = 'OMNI_DYNAMIC_PROVIDER';

export function Customer(
  customer: string
): ClassDecorator {
  return (target) => {
    const current = chooseArray(Reflect.getMetadata(OMNI_PROVIDER_CUSTOMERS, target), []);
    Reflect.defineMetadata(
      OMNI_PROVIDER_CUSTOMERS,
      current.concat(customer),
      target
    );
    return target;
  };
}

export function Provider(
  classRef: { new () }
): ClassDecorator {
  return (target) => {
    const current = chooseArray(Reflect.getMetadata(OMNI_PROVIDER_CLASSES, target), []);
    Reflect.defineMetadata(
      OMNI_PROVIDER,
      true,
      target
    );
    Reflect.defineMetadata(
      OMNI_PROVIDER_CLASSES,
      current.concat(classRef),
      target
    );
    return target;
  };
}

export function DynamicProvider(): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(
      OMNI_DYNAMIC_PROVIDER,
      true,
      target
    );
    return target;
  };
}

export interface IDynamicProvider{

  process(
    gateway: Type<Record<string, unknown>>,
    filepath: string,
    methodName: string,
    argumentList: Array<unknown>
  ): Promise<unknown>;

}
