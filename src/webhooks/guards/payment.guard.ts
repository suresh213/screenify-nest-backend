import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';

import { WebhookService } from '../webhooks.service';

@Injectable()
export class PaymentGuard implements CanActivate {
  constructor(@Inject(WebhookService) private webhookService: WebhookService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    let request = context.switchToHttp().getRequest();
    const { captured, request: alteredRequest } = this.webhookService.validateHeader(request);

    request = alteredRequest;
    return captured;
  }
}
