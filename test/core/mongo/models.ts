import { MongoConnection } from './mongo-connection';
import { User, UserDocument, UserSchema } from '../../../src/modules/user/schemas/user.schema';
import { Ticket, TicketDocument, TicketSchema } from '../../../src/modules/ticket/schemas/ticket.schema';
import { Room, RoomDocument, RoomSchema } from '../../../src/modules/room/schemas/room.schema';
import { Movie, MovieDocument, MovieSchema } from '../../../src/modules/movie/schemas/movie.schema';
import { Sequence, SequenceDocument, SequenceSchema } from '../../../src/core/sequence/sequence.schema';

export const movieModel = (mongoConnection: MongoConnection) => {
  return mongoConnection.connection.model<MovieDocument>(Movie.name, MovieSchema);
};

export const roomModel = (mongoConnection: MongoConnection) => {
  return mongoConnection.connection.model<RoomDocument>(Room.name, RoomSchema);
};

export const sequenceModel = (mongoConnection: MongoConnection) => {
  return mongoConnection.connection.model<SequenceDocument>(Sequence.name, SequenceSchema);
};

export const ticketModel = (mongoConnection: MongoConnection) => {
  return mongoConnection.connection.model<TicketDocument>(Ticket.name, TicketSchema);
};

export const userModel = (mongoConnection: MongoConnection) => {
  return mongoConnection.connection.model<UserDocument>(User.name, UserSchema);
};
