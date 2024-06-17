import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Boolean, default: false })
  isSeen: boolean;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: false })
  user: User;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
