import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Assessment } from './assessment.schema';

export type CandidateAssessmentDocument = CandidateAssessment & Document;

@Schema({ timestamps: true })
export class CandidateAssessment {
  @Prop({ type: String, required: true })
  email: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Assessment',
    required: true,
  })
  assessment: Assessment;

  @Prop({ type: JSON })
  result: JSON;

  @Prop({ type: Boolean, default: false })
  isCompleted: boolean;

  @Prop({ type: Date })
  startTime: Date;

  @Prop({ type: Date })
  endTime: Date;

  @Prop({ type: JSON })
  answers: JSON;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const CandidateAssessmentSchema =
  SchemaFactory.createForClass(CandidateAssessment);
