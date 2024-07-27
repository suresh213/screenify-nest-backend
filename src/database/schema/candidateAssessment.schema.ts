import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Assessment } from './assessment.schema';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.schema';

export type CandidateAssessmentDocument = CandidateAssessment & Document;

@Schema({ timestamps: true })
export class CandidateAssessment {
  @ApiProperty({ description: 'The candidate email' })
  @Prop({ type: String, required: true })
  email: string;

  @ApiProperty({ description: 'The assessment identifier' })
  @Prop({
    type: Types.ObjectId,
    ref: 'Assessment',
    required: true,
  })
  assessment: Assessment;

  @ApiProperty({ description: 'Candidate Invited by' })
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  invitedBy: User;

  @ApiProperty({ description: 'The assessment result' })
  @Prop({ type: JSON, default: null })
  result: JSON;

  @ApiProperty({ description: 'The completion status' })
  @Prop({ type: Boolean, default: false })
  isCompleted: boolean;

  @ApiProperty({ description: 'The start time of the assessment' })
  @Prop({ type: Date, default: null })
  startTime: Date;

  @ApiProperty({ description: 'The end time of the assessment' })
  @Prop({ type: Date, default: null })
  endTime: Date;

  @ApiProperty({ description: 'The submission time of the assessment' })
  @Prop({ type: Date, default: null })
  submissionTime: Date;

  @ApiProperty({ description: 'The answers provided by the candidate' })
  @Prop({ type: JSON, default: null })
  answers: JSON;

  @ApiProperty({ description: 'The created date' })
  @Prop({ type: Date })
  createdAt: Date;

  @ApiProperty({ description: 'The updated date' })
  @Prop({ type: Date })
  updatedAt: Date;
}

export const CandidateAssessmentSchema =
  SchemaFactory.createForClass(CandidateAssessment);
