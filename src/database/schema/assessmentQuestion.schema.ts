import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Assessment } from './assessment.schema';

export type AssessmentQuestionDocument = AssessmentQuestion & Document;

@Schema({ timestamps: true })
export class AssessmentQuestion {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  answer: string;

  @Prop({ type: Array<Object> })
  example: Object[];

  @Prop({ type: Array<Object> })
  testCases: Object[];

  @Prop({ type: Array<string> })
  options: string[];

  @Prop({ type: String })
  difficulty?: string;

  @Prop({ type: String })
  solution?: string;

  @Prop({ type: Object })
  functionSignature?: Object;

  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Assessment' })
  assessment: Assessment;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const AssessmentQuestionSchema =
  SchemaFactory.createForClass(AssessmentQuestion);
