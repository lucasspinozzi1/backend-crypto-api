import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'common/common.module';
import { LoggingInterceptor } from 'common/interceptor/logging.interceptor';
import { ContextInterceptor } from 'common/interceptor/context.interceptor';
import { ContextMiddleware } from 'common/middleware/context.middleware';
import { exist, choose } from 'common/util';
import { SerializeInterceptor } from 'common/interceptor/serialize.interceptor';
import { RouteModule } from 'route/route.module';
import { ENTITIES } from './model/index';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return {
          type: 'mysql',
          host: choose(process.env.DB_HOST, '0.0.0.0'),
          port: exist(process.env.DB_PORT) ? parseInt(process.env.DB_PORT) : 3306,
          username: choose(process.env.DB_USERNAME, 'dbuser'),
          password: choose(process.env.DB_PASSWORD, 'dbpass'),
          database: choose(process.env.DB_NAME, 'cryptoDb'),
          entities: ENTITIES,
          retryAttempts: parseInt(choose(process.env.DB_RETRY_ATTEMPS, '100')),
          retryDelay: parseInt(choose(process.env.DB_RETRY_DELAY, '5000')),
          verboseRetryLog: true,
          // synchronize: true
        };
      }
    }),
    CommonModule,
    RouteModule,
    AuthModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    }, {
      provide: APP_INTERCEPTOR,
      useClass: ContextInterceptor
    }, {
      provide: APP_INTERCEPTOR,
      useClass: SerializeInterceptor
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ContextMiddleware)
      .forRoutes('*');
  }
}
