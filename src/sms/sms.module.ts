import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SMSService } from './sms.service';

@Global()
@Module({
  imports: [ConfigModule],
})
export class SMSModule {
  static register(): DynamicModule {
    return {
      module: SMSModule,
      providers: [SMSService],
      exports: [SMSService],
    };
  }
}
