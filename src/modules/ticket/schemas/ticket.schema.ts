import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'tickets',
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
export class Ticket {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  readonly _id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, defaultField: true })
  user: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, defaultField: true })
  movie: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, defaultField: true })
  session: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Number, defaultField: true })
  ticketNumber: number;

  @Prop({ type: Date, defaultField: true })
  movieDate: Date;

  @Prop({ type: Date, defaultField: true })
  watchedAt: Date;

  @Prop({ type: Number, defaultField: true })
  price: number;

  @Prop({ type: Number, defaultField: true })
  status: number;
}

// eslint-disable-next-line
export type TicketDocument = Ticket & Document;
export const TicketSchema = SchemaFactory.createForClass(Ticket);
