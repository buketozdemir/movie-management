import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'rooms',
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
export class Room {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  readonly _id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, defaultField: true })
  name: string;

  @Prop({ type: Number, defaultField: true })
  capacity: number;

  @Prop({ type: Number, defaultField: true })
  status: number;
}

// eslint-disable-next-line
export type RoomDocument = Room & Document;
export const RoomSchema = SchemaFactory.createForClass(Room);
