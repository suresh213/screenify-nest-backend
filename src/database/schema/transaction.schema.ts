import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Transaction extends Document {
  @ApiProperty({ description: 'Amount of transaction' })
  @Prop({ type: Number, required: true })
  amount: number;

  @ApiProperty({ description: 'Status of transaction' })
  @Prop({ type: String, required: true })
  status: string;

  @ApiProperty({ description: 'Type of transaction' })
  @ApiProperty({ description: '' })
  @Prop({ type: String, required: true })
  type: string;

  @ApiProperty({ description: 'Details of transaction' })
  @Prop({ type: JSON, required: false, default: null })
  transactionDetails?: Object;

  @ApiProperty({ description: 'Payment order id' })
  @Prop({ type: String })
  paymentOrderId: string;

  @ApiProperty({ description: 'Payment details' })
  @Prop({ type: JSON, required: false, default: null })
  paymentDetails: Object;

  @ApiProperty({ description: 'User who paid the transaction' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  paidBy: User;

  @ApiProperty({ description: 'Date of payment' })
  @Prop({ type: Date, required: false })
  paymentDate: Date;

  @ApiProperty({ description: 'Date of creation' })
  @Prop({ type: Date })
  createdAt: Date;

  @ApiProperty({ description: 'Date of update' })
  @Prop({ type: Date })
  updatedAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
