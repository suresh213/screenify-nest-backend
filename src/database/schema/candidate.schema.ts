import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.schema';

export type CandidateDocument = Candidate & Document;

@Schema({ timestamps: true })
export class Candidate {
  @ApiProperty({ description: 'Candidate name' })
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty({ description: 'Candidate email' })
  @Prop({ type: String, required: true })
  email: string;

  @ApiProperty({ description: 'Candidate mobile number' })
  @Prop({ type: String })
  mobileNumber: string;

  @ApiProperty({ description: 'Candidate Created by' })
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy: User;

  @ApiProperty({ description: 'The created date' })
  @Prop({ type: Date })
  createdAt: Date;

  @ApiProperty({ description: 'The updated date' })
  @Prop({ type: Date })
  updatedAt: Date;
}

export const CandidateSchema = SchemaFactory.createForClass(Candidate);
