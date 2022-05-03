import * as async_hooks from 'async_hooks';
import * as fs from 'fs';
import {
  ExecutionContext,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit
} from '@nestjs/common';

interface ExecutionAsyncResource{
  context?: ExecutionContext;
}

@Injectable()
export class ContextService implements OnModuleInit, OnModuleDestroy{

  private context: ExecutionContext;

  private asyncHook: async_hooks.AsyncHook;

  private readonly logger = new Logger(ContextService.name);

  static logSync(content: string): void{
    fs.writeSync(1, content);
  }

  onModuleInit(): void{
    this.asyncHook = async_hooks.createHook({
      init:(
        _asyncId: number,
        _type: string,
        _triggerAsyncId: number,
        resource: ExecutionAsyncResource
      )=>{
        resource.context = this.context;
      },
      before:()=>{
        const resource = async_hooks.executionAsyncResource() as ExecutionAsyncResource;
        this.context = resource.context;
      },
      after:()=>{
        // do nothing
      }
    }).enable();
    this.logger.log('context async-hook enabled');
  }

  getContext(): ExecutionContext{
    return this.context;
  }

  clearContext(): void{
    delete this.context;
  }

  setContext(context: ExecutionContext): void{
    this.context = context;
  }

  onModuleDestroy(): void{
    this.asyncHook.disable();
    this.logger.log('context async-hook disabled');
  }

}
