import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type AssessmentDocument = Assessment & Document;

@Schema({ timestamps: true })
export class Assessment {
  @ApiProperty({ description: 'Name of the assessment' })
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty({ description: 'Description of the assessment' })
  @Prop({ type: String, required: true })
  description: string;

  @ApiProperty({ description: 'Role of the assessment' })
  @Prop({ type: String, required: true })
  role: string;

  @ApiProperty({ description: 'Experience of the assessment' })
  @Prop({ type: String, required: true })
  experience: string;

  @ApiProperty({ description: 'Difficulty of the assessment' })
  @Prop({ type: String, required: true })
  difficulty: string;

  @ApiProperty({ description: 'Total number of questions in the assessment' })
  @Prop({ type: String, required: true })
  totalQuestions: string;

  @ApiProperty({ description: 'Time limit for the assessment' })
  @Prop({ type: String, required: true })
  timeLimit: string;

  @ApiProperty({ description: 'Type of the assessment' })
  @Prop({ type: String, required: true, default: 'Coding' })
  type: string;

  @ApiProperty({ description: 'Settings for the assessment' })
  @Prop({ type: JSON, required: true })
  settings: JSON;

  @ApiProperty({ description: 'User who created the assessment' })
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  createdBy: User;

  @ApiProperty({ description: 'Date when assessment was created' })
  @Prop({ type: Date })
  createdAt: Date;

  @ApiProperty({ description: 'Date when assessment was last updated' })
  @Prop({ type: Date })
  updatedAt: Date;
}

export const AssessmentSchema = SchemaFactory.createForClass(Assessment);
