import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @ApiProperty({
    description: 'The email of the user',
  })
  @Prop({ type: String, required: true, unique: true, lowercase: true })
  email: string;

  @ApiProperty({ description: 'The name of the user' })
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty({
    description: 'The password of the user',
  })
  @Prop({ type: String })
  password: string;

  @ApiProperty({
    description: 'The avatar URL of the user',
  })
  @ApiProperty({ description: '' })
  @Prop({ type: String })
  avatar: string;

  @ApiProperty({
    description: 'The mobile number of the user',
  })
  @Prop({ type: String, unique: true })
  mobileNumber: string;

  @ApiProperty({ description: 'The provider of the user' })
  @Prop({ type: String, required: true })
  provider: string;

  @ApiProperty({
    description: 'The reset information of the user for forgot password',
  })
  @Prop({ type: JSON })
  forgotPasswordReset: Object;

  @ApiProperty({
    description: 'The creation date of the user',
  })
  @Prop({ type: Date })
  createdAt: Date;

  @ApiProperty({
    description: 'The last update date of the user',
  })
  @Prop({ type: Date })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
