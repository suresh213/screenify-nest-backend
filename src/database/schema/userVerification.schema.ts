import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class UserVerification extends Document {
  @Prop({ type: String })
  type: string;

  @Prop({ type: String })
  refId: string;

  @Prop({ type: String })
  value: string;

  @Prop({ type: String })
  secretCode: string;

  @Prop({ type: String, ref: 'User' })
  userId: string;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const UserVerificationSchema =
  SchemaFactory.createForClass(UserVerification);
