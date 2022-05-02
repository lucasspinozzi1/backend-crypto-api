import * as async_hooks from 'async_hooks';
import * as fs from 'fs';
import {
  ExecutionContext,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit
} from '@nestjs/common';
import * as ErrorStackParser from 'error-stack-parser';
import { exist } from 'common/util';

interface ExecutionAsyncResource{
  context?: ExecutionContext;
  asyncStack: Array<ErrorStackParser.StackFrame>;
}

const trace = process.env.NODE_ENV !== 'production';

@Injectable()
export class ContextService implements OnModuleInit, OnModuleDestroy{

  private context: ExecutionContext;

  private asyncStack: Array<ErrorStackParser.StackFrame> = trace ? [] : null;

  private asyncHook: async_hooks.AsyncHook;

  private readonly logger = new Logger(ContextService.name);

  static logSync(content: string){
    fs.writeSync(1, content);
  }

  onModuleInit() {
    this.asyncHook = async_hooks.createHook({
      init:(
        _asyncId: number,
        _type: string,
        _triggerAsyncId: number,
        resource: ExecutionAsyncResource
      )=>{
        resource.context = this.context;
        if(trace){
          resource.asyncStack = this.asyncStack;
          const stack = ErrorStackParser.parse(new Error());
          if(stack.length > 1){
            this.asyncStack.push(stack[2]);
          }
        }
      },
      before:()=>{
        const resource = async_hooks.executionAsyncResource() as ExecutionAsyncResource;
        this.context = resource.context;
        if(trace){
          this.asyncStack = resource.asyncStack;
          const stack = ErrorStackParser.parse(new Error());
          if(!exist(this.asyncStack)){
            this.asyncStack = [];
          }
          if(stack.length > 1){
            this.asyncStack.push(stack[2]);
          }
        }
      },
      after:()=>{
        if(trace){
          const resource = async_hooks.executionAsyncResource() as ExecutionAsyncResource;
          if(exist(resource.asyncStack)){
            resource.asyncStack.pop();
          }
        }
      }
    }).enable();
  }

  getContext(){
    return this.context;
  }

  clearContext(){
    delete this.context;
  }

  setContext(context: ExecutionContext){
    this.context = context;
  }

  onModuleDestroy() {
    this.asyncHook.disable();
  }

  initAsyncStack() {
    this.asyncStack = [];
  }

  getAsyncStack(): Array<ErrorStackParser.StackFrame> {
    return this.asyncStack;
  }
}
