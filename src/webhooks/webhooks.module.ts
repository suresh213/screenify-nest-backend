import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { WebhookController } from './webhooks.controller';
import { WebhookService } from './webhooks.service';

@Module({
  imports: [ConfigModule],
  controllers: [WebhookController],
  providers: [WebhookService],
  exports: [WebhookService],
})
export class WebhookModule {}
