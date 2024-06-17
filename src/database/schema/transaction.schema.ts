import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: String, required: true })
  status: string;

  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: JSON, required: false })
  transactionDetails?: Object;

  @Prop({ type: String })
  paymentOrderId: string;

  @Prop({ type: JSON, required: false })
  paymentDetails: Object;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  paidBy: User;

  @Prop({ type: Date, required: false })
  paymentDate: Date;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
