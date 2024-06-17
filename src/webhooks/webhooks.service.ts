import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';

@Injectable()
export class WebhookService {
  constructor(private configService: ConfigService) {}

  validateHeader(request: any) {
    const shasum = crypto.createHmac(
      'sha256',
      this.configService.get('payment.razorpayWebhookSecret'),
    );

    shasum.update(JSON.stringify(request.body));
    const digest = shasum.digest('hex');

    if (digest === request.headers['x-razorpay-signature']) {
      const { order_id, status, id } = request.body.payload.payment.entity;
      if (status === 'captured') {
        request.paymentDetails = request.body.payload.payment.entity;
        return { captured: true, request };
      }
    }

    return { captured: false, request };
  }
}
