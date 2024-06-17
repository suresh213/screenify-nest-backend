import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: String, required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: String })
  avatar: string;

  @Prop({ type: String, unique: true })
  mobileNumber: string;

  @Prop({ type: String, required: true })
  provider: string;

  @Prop({ type: JSON })
  forgotPasswordReset: Object;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
