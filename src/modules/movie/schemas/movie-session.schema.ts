import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  timestamps: true,
  id: true,
  _id: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (record: any, converted) => {
      // eslint-disable-next-line no-param-reassign
      converted.id = record._doc.id || record._doc._id;
      delete converted._id;
    },
  },
})
export class MovieSession {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  readonly _id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Date })
  startTime: Date;

  @Prop({ type: Number })
  timeSlot: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Room' })
  room: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Number })
  price: number;

  @Prop({ type: Number })
  status: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  updatedBy: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: mongoose.Schema.Types.ObjectId;
}

export const MovieSessionSchema = SchemaFactory.createForClass(MovieSession);
