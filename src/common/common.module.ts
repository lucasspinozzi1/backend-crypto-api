import { Global, Module } from '@nestjs/common';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { Json2Js, Js2Json} from 'common/json2js';
import { ContextService } from './interceptor/context.service';
import { ContextMiddleware } from './middleware/context.middleware';

@Global()
@Module({
  imports: [
    DiscoveryModule
  ],
  controllers: [],
  providers: [
    ContextMiddleware,
    ContextService,
    Json2Js,
    Js2Json
  ],
  exports: [
    ContextService,
    ContextMiddleware,
    Json2Js,
    Js2Json
  ]
})
export class CommonModule { }
