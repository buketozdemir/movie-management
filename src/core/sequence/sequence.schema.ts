import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  collection: 'sequences',
  timestamps: true,
  id: true,
  _id: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (doc, converted) => {
      // eslint-disable-next-line no-param-reassign
      delete converted._id;
    },
  },
})
export class Sequence {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  readonly _id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String })
  code: string;

  @Prop({ type: Number })
  value: number;
}

export type SequenceDocument = Sequence & Document;
export const SequenceSchema = SchemaFactory.createForClass(Sequence);
