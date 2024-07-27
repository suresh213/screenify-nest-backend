import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @ApiProperty({
    example: 'john@example.com',
    description: 'The email of the user',
  })
  @Prop({ type: String, required: true, unique: true, lowercase: true })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  @Prop({ type: String })
  password: string;

  @ApiProperty({
    example: 'https://example.com/avatar.png',
    description: 'The avatar URL of the user',
  })
  @ApiProperty({ description: '' })
  @Prop({ type: String })
  avatar: string;

  @ApiProperty({
    example: '1234567890',
    description: 'The mobile number of the user',
  })
  @Prop({ type: String, unique: true })
  mobileNumber: string;

  @ApiProperty({ example: 'local', description: 'The provider of the user' })
  @Prop({ type: String, required: true })
  provider: string;

  @ApiProperty({
    description: 'The reset information of the user for forgot password',
  })
  @Prop({ type: JSON })
  forgotPasswordReset: Object;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'The creation date of the user',
  })
  @Prop({ type: Date })
  createdAt: Date;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'The last update date of the user',
  })
  @Prop({ type: Date })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
