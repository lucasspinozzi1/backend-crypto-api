import { IncomingMessage } from 'http';
import { OnModuleInit, Logger, Injectable, Type } from '@nestjs/common';
import { DiscoveredClass, DiscoveryService } from '@golevelup/nestjs-discovery';
import { ContextService } from 'common/context/context.service';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { choose, exist } from 'common/util';
import {
  IDynamicProvider,
  OMNI_DYNAMIC_PROVIDER,
  OMNI_PROVIDER,
  OMNI_PROVIDER_CLASSES,
  OMNI_PROVIDER_CUSTOMERS
} from './provider';
import {
  OMNI_GATEWAY, OMNI_GATEWAY_FILEPATH, OMNI_GATEWAY_TO_PROVIDE
} from './gateway';

interface GatewayContainer {
  name: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  instance: Record<string, Function>;
  methods: [string];
  filepath: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  providers: {[id: string]: Record<string, Function>};
}

interface IDynamicProviderContainer {
  name: string;
  instance: IDynamicProvider;
}

@Injectable()
export class Resolver implements OnModuleInit{

  private readonly logger = new Logger(Resolver.name);

  private readonly dynamicProviders = new Map<string, IDynamicProviderContainer>();

  // TODO use local variable
  private gateways = new Map<Type<Record<string, unknown>>, GatewayContainer>();

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly contextService: ContextService
  ) {  }

  private static missing(instance: Record<string, unknown>, methods: Array<string>): Array<string>{
    return methods.filter((method)=> {
      return typeof instance[method] == 'undefined';
    });
  }

  async onModuleInit(): Promise<void> {
    await this.explore();
  }

  async explore(): Promise<void> {
    await this.collectAbstracGateways();
    await this.collectDynamicProviders();
    await this.collectProviders();
    this.patchMethods();
    delete this.gateways;
  }

  private async collectAbstracGateways() {
    const discoveredGateways = await this.discoveryService
      .providersWithMetaAtKey<Record<string, unknown>>(OMNI_GATEWAY);
    for (const discoveredGateway of discoveredGateways) {
      const discoveredClass: DiscoveredClass = discoveredGateway.discoveredClass;
      const className = discoveredClass.name;
      const methods = Reflect.getMetadata(
        OMNI_GATEWAY_TO_PROVIDE,
        discoveredClass.dependencyType.prototype
      );
      const filepath = Reflect.getMetadata(
        OMNI_GATEWAY_FILEPATH,
        discoveredClass.dependencyType
      );
      this.gateways.set(discoveredClass.dependencyType, {
        name: className,
        instance: discoveredGateway.discoveredClass.instance,
        methods: methods,
        filepath: filepath,
        providers: {}
      });
      this.logger.debug(`Found Gateway: ${className}`);
    }
  }

  private async collectProviders() {
    const discoveredProviders = await this.discoveryService
      .providersWithMetaAtKey<Record<string, unknown>>(OMNI_PROVIDER);
    for (const discoveredProvider of discoveredProviders) {
      const discoveredClass: DiscoveredClass = discoveredProvider.discoveredClass;
      const className = discoveredClass.name;
      let customers = Reflect.getMetadata(
        OMNI_PROVIDER_CUSTOMERS,
        discoveredClass.dependencyType
      );
      if (!exist(customers) || customers.length === 0) {
        customers = ['default'];
      }
      const gateways = Reflect.getMetadata(
        OMNI_PROVIDER_CLASSES,
        discoveredClass.dependencyType
      );
      for (const gateway of gateways) {
        const gatewayContainer = this.gateways.get(gateway);
        const missing = Resolver.missing(discoveredClass.instance, gatewayContainer.methods);
        const gatewayName = gatewayContainer.name;
        if (missing.length > 0) {
          const msg = `${className} missing methods from ${gatewayName}: [${missing.join(',')}]`;
          throw new Error(msg);
        }
        const providers = gatewayContainer.providers;
        for (const customer of customers) {
          if(this.dynamicProviders.has(customer)){
            const providerName = this.dynamicProviders.get(customer).name;
            const msg = customer === 'default'?
              `cannot subscribe multiple default ${gatewayName} 
                instances [${className}, ${providerName}]`:
              `cannot subscribe multiple ${gatewayName} 
                instances for same customer(${customer}) [${className}, ${providerName}]`;
            throw new Error(msg);
          }
          if (typeof providers[customer] != 'undefined') {
            const providerName = providers[customer].constructor.name;
            const msg = customer === 'default'?
              `cannot subscribe multiple default ${gatewayName} 
                instances [${className}, ${providerName}]`:
              `cannot subscribe multiple ${gatewayName} 
                instances for same customer(${customer}) [${className}, ${providerName}]`;
            throw new Error(msg);
          }
          this.logger.log(
            customer === 'default' ?
              `${className} ${gatewayName} registered as default provider` :
              `${className} ${gatewayName} registered for customer '${customer}'`
          );
          providers[customer] = discoveredClass.instance;
        }
      }
    }
  }

  private async collectDynamicProviders() {
    const discoveredDynamicProviders = await this.discoveryService
      .providersWithMetaAtKey<Record<string, unknown>>(OMNI_DYNAMIC_PROVIDER);
    for (const discoveredDynamicProvider of discoveredDynamicProviders) {
      const discoveredClass: DiscoveredClass = discoveredDynamicProvider.discoveredClass;
      let customers = Reflect.getMetadata(
        OMNI_PROVIDER_CUSTOMERS,
        discoveredClass.dependencyType
      );
      if (!exist(customers) || customers.length === 0) {
        customers = ['default'];
      }
      const className = discoveredClass.name;
      const dynamicProvider = discoveredClass.instance as IDynamicProvider;
      if(typeof dynamicProvider.process !== 'function'){
        this.logger.error(`dynamic providers ${className} has not process method`);
        continue;
      }
      for(const customer of customers){
        if(this.dynamicProviders.has(customer)){
          const registered = this.dynamicProviders.get(customer);
          const message = `multiple dynamic providers for customer ${customer} ` +
            `[${className}, ${registered.name}]`;
          this.logger.error(message);
          throw new Error(message);
        }
        this.logger.log(`registering dynamic provider ${className} for customer ${customer}`);
        this.dynamicProviders.set(customer, {
          instance: dynamicProvider,
          name: className
        });
      }
    }
  }

  private patchMethods() {
    this.gateways.forEach((value: GatewayContainer, key, _map) => {
      for (const method of value.methods) {
        ((value, method)=>{
          const providers = value.providers;
          const gatewayName = value.name;
          const original = value.instance[method];
          value.instance[method] = (...theArgs: any) => {
            const customer = this.customer();
            this.logger.debug(`trying to resolve ${gatewayName} 
              provider for consumer ${customer}`);
            const provider = providers[customer];
            if (exist(provider)) {
              const providerName = provider.constructor.name;
              const msg = `using ${providerName} as ${gatewayName} ` +
                `provider for consumer ${customer}`;
              this.logger.debug(msg);
              return provider[method](...theArgs);
            }
            if (this.dynamicProviders.has(customer)) {
              const dynamicProvider = this.dynamicProviders.get(customer);
              const providerName = dynamicProvider.name;
              const msg = `using ${providerName} as ${gatewayName} ` +
                `dynamic provider for consumer ${customer}`;
              this.logger.debug(msg);
              return dynamicProvider.instance.process(key, value.filepath, method, theArgs);
            }
            const msg = `cannot resolver ${gatewayName} provider for customer ${customer}`;
            this.logger.error(msg);
            return original.apply(value.instance, theArgs);
          };
        })(value, method);
      }
    });
  }

  private customer(): string{
    const context = this.contextService.getContext();
    if(context.getType() === 'http'){
      const httpContext: HttpArgumentsHost = context.switchToHttp();
      const request = httpContext.getRequest<IncomingMessage>();
      return choose(request.headers.customer as string, 'default');
    }
  }

}
