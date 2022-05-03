import { chooseArray } from 'common/util';
import * as ErrorStackParser from 'error-stack-parser';

export const OMNI_GATEWAY = 'OMNI_GATEWAY';
export const OMNI_GATEWAY_FILEPATH = 'OMNI_GATEWAY_FILEPATH';
export const OMNI_GATEWAY_TO_PROVIDE = 'OMNI_GATEWAY_TO_PROVIDE';

/**
 * @ToProvide() demands Providers to implements this methods
 * It can not be detected in (Typescript) compiling time due to Gateways are
 * concrete classes, so it must be checked in startup time
 */
export function ToProvide(): MethodDecorator {
  return (
    target: any,
    propertyKey: string | symbol,
    _descriptor: PropertyDescriptor
  ) => {
    const current = chooseArray(Reflect.getMetadata(OMNI_GATEWAY_TO_PROVIDE, target), []);
    Reflect.defineMetadata(
      OMNI_GATEWAY_TO_PROVIDE,
      current.concat(propertyKey),
      target
    );
    return target;
  };
}

/**
 * @Gateway() allows to declare an abstract gateway. It means there must
 * be a provider (associated to one or more customers)
 * wich implement this logic in order application can make use of it.
 * Example
 * // @Gateway()
 * // @Injectable()
 * // export class AccountGateway {
 * //
 * //   @ToProvide()
 * //   async movements(
 * //     _movementsQueryDTO: MovementsQueryDTO
 * //   ): Promise<MovementsResultDTO> {
 * //     return Promise.reject('To be implemented');
 * //   }
 * //
 * //   @ToProvide()
 * //   async internalAccount(
 * //     _internalQueryDTO: ExternalAccountQueryDTO
 * //   ): Promise<ExternalAccountResultDTO> {
 * //     return Promise.reject('To be implemented');
 * //   }
 * // }
 * //
 * It needs to be a non-abstract class in order to save Typescript metadata.
 * @ToProvide() demands Providers to implements this methods
 * It can not be detected in (Typescript) compiling time due to Gateways are
 * concrete classes, so it must be checked in startup time
 * Gateways must be added to the providers list of some module
 * in order to allow service discovery
 * //@Module({
 * //  providers: [
 * //    AccountGateway
 * //  ],
 * //  exports: [
 * //    AccountGateway
 * //  ]
 * //})
 * //export class GatewayModule { }
 * related: [Provider]{@link ./provider.ts#Provider}
 */
export function Gateway(): ClassDecorator {
  return (target) => {
    const stack = ErrorStackParser.parse(new Error());
    if(stack.length > 2){
      const frame = stack[3];
      const pwd = process.cwd();
      const path = frame.fileName.substring(pwd.length);
      Reflect.defineMetadata(
        OMNI_GATEWAY_FILEPATH,
        path,
        target
      );
    }
    Reflect.defineMetadata(
      OMNI_GATEWAY,
      true,
      target
    );
    return target;
  };
}
