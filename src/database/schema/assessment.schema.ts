import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type AssessmentDocument = Assessment & Document;

@Schema({ timestamps: true })
export class Assessment {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  role: string;

  @Prop({ type: String, required: true })
  experience: string;

  @Prop({ type: String, required: true })
  difficulty: string;

  @Prop({ type: String, required: true })
  totalQuestions: string;

  @Prop({ type: String, required: true })
  timeLimit: string;

  @Prop({ type: String })
  type?: string;

  @Prop({ type: JSON, required: true })
  settings: JSON;

  @Prop({ type: Types.ObjectId, required: true })
  createdBy: User;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const AssessmentSchema = SchemaFactory.createForClass(Assessment);
