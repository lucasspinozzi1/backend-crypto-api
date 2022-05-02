import { Controller, Get, Logger } from '@nestjs/common';

@Controller('')
export class AppController {

  private readonly logger = new Logger(AppController.name);

  @Get('/health')
  async health(): Promise<{status: string}> {
    this.logger.log('health');
    return Promise.resolve({
      status: 'OK'
    });
  }

  @Get('/')
  async check(): Promise<{ status: string }> {
    this.logger.log('health check');
    return Promise.resolve({
      status: 'OK'
    });
  }
}
