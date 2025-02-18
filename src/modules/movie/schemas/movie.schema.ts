import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MovieSession, MovieSessionSchema } from './movie-session.schema';

@Schema({
  collection: 'movies',
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
export class Movie {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  readonly _id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, defaultField: true })
  name: string;

  @Prop({ type: Number, defaultField: true })
  ageRestriction: number;

  @Prop({ type: Date, defaultField: true })
  releaseDate: Date;

  @Prop({ type: Number, defaultField: true })
  status: number;

  @Prop({ type: [MovieSessionSchema] })
  sessions: MovieSession[];

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  updatedBy: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  deletedBy: mongoose.Schema.Types.ObjectId;
}

export type MovieDocument = Movie & Document;
export const MovieSchema = SchemaFactory.createForClass(Movie);
