import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import moment from 'moment';

@Injectable()
export class PaymentGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { isSubscriptionActive, subscriptionDetails } = request.user;

    if (!isSubscriptionActive) {
      throw new HttpException(
        'You need to upgrade to a paid plan',
        HttpStatus.PAYMENT_REQUIRED
      );
    }

    if (isSubscriptionActive && moment(subscriptionDetails.planEndDate).isBefore(moment())) {
      throw new HttpException(
        'Your plan has expired. You need to subscribe for paid plan to access all the features.',
        HttpStatus.PAYMENT_REQUIRED
      );
    }

    return true;
  }
}
