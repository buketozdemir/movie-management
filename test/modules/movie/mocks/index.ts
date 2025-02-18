import { MovieStatus } from '../../../../src/modules/movie/movie.enum';
import mongoose from 'mongoose';

export const movieName = 'Test Movie X';
export const movieStatus = MovieStatus.Active;
export const movieAgeRestriction = 7;
export const movieReleaseDate = new Date();
export const movieCreatedBy = new mongoose.Types.ObjectId().toString();
