import { Body,Controller, Post } from '@nestjs/common';

import { TransactionService } from './transaction.service';

@Controller('/transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('/order/create')
  async createOrder(@Body() order: any) {
    const data = await this.transactionService.create(order);
    return data;
  }
}
