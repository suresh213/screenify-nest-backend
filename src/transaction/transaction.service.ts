import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from '../database/schema/transaction.schema';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
  ) {}

  async create(transaction: any): Promise<any> {
    try {
      const createdTransaction = await this.transactionModel.create(
        transaction,
      );
      return createdTransaction;
    } catch (err) {}
  }

  async update(condition: any, updatedData: any) {
    return await this.transactionModel.updateOne(condition, updatedData).exec();
  }
}
