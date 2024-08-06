import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Segment extends Document {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  description: string;
}

export const SegmentSchema = SchemaFactory.createForClass(Segment);
