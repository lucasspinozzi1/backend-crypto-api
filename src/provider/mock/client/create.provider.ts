import { Injectable, Logger } from '@nestjs/common';
import { Customer, Provider } from 'common/resolver/provider';
import { CreateGateway } from '../../../route/client/create/use-case/create.gateway';

@Injectable()
@Provider(CreateGateway)
@Customer('mock')
export class MockCreateClientProvider implements CreateGateway {
  private readonly logger = new Logger(MockCreateClientProvider.name);

  async create(createRequestDTO: any): Promise<any> {
    this.logger.debug('Example mock create client gateway');
    return Promise.resolve({});
  }
}
