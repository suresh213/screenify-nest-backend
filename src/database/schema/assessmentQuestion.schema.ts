import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { Assessment } from './assessment.schema';

export type AssessmentQuestionDocument = AssessmentQuestion & Document;

@Schema({ timestamps: true })
@Schema({ timestamps: true })
export class AssessmentQuestion {
  @ApiProperty({ description: 'The title of the question' })
  @Prop({ type: String, required: true })
  title: string;

  @ApiProperty({ description: 'The description of the question' })
  @Prop({ type: String })
  description: string;

  @ApiProperty({ description: 'The answer to the question' })
  @Prop({ type: String })
  answer: string;

  @ApiProperty({ description: 'Examples of the question' })
  @ApiProperty({ description: '' })
  @Prop({ type: Array<Object> })
  example: Object[];

  @ApiProperty({ description: 'Test cases for the question' })
  @Prop({ type: Array<Object> })
  testCases: Object[];

  @ApiProperty({ description: 'Possible options for the question' })
  @Prop({ type: Array<string> })
  options: string[];

  @ApiProperty({ description: 'The difficulty level of the question' })
  @Prop({ type: String })
  difficulty?: string;

  @ApiProperty({ description: 'The solution to the question' })
  @Prop({ type: String })
  solution?: string;

  @ApiProperty({ description: 'The function signature for the question' })
  @Prop({ type: Object })
  functionSignature?: Object;

  @ApiProperty({ description: 'The type of the question' })
  @Prop({ type: String, required: true })
  type: string;

  @ApiProperty({ description: 'The assessment this question belongs to' })
  @Prop({ type: Types.ObjectId, required: true, ref: 'Assessment' })
  assessment: Assessment;

  @ApiProperty({ description: 'The time the question was created' })
  @Prop({ type: Date })
  createdAt: Date;

  @ApiProperty({ description: 'The time the question was last updated' })
  @Prop({ type: Date })
  updatedAt: Date;
}

export const AssessmentQuestionSchema =
  SchemaFactory.createForClass(AssessmentQuestion);
