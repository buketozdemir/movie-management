import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'users',
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
export class User {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  readonly _id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, defaultField: true })
  userName: string;

  @Prop({ type: String, defaultField: true })
  firstName: string;

  @Prop({ type: String, defaultField: true })
  lastName: string;

  @Prop({ type: Date })
  birthDate: Date;

  @Prop({ type: Number })
  status: number;

  @Prop({ type: String })
  password: string;

  @Prop({ type: [Number] })
  roles: number[];

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  updatedBy: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  deletedBy: mongoose.Schema.Types.ObjectId;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ userName: 1 }, { unique: true });
