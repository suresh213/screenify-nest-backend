import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type AssessmentQuestionDocument = AssessmentQuestion & Document;

@Schema({ timestamps: true })
export class AssessmentQuestion {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String })
  answer: string;

  @Prop({ type: Array<string> })
  options: string[];

  @Prop({ type: String })
  difficulty?: string;

  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const AssessmentQuestionSchema =
  SchemaFactory.createForClass(AssessmentQuestion);
