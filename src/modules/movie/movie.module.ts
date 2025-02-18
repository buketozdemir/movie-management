import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from './schemas/movie.schema';
import { MovieSessionService } from './services/movie-session.service';
import { MovieService } from './services/movie.service';
import { MovieDataAccess } from './data-accesses/movie.data-access';
import { MovieSessionDataAccess } from './data-accesses/movie-session.data-access';
import { MovieController } from './controllers/movie.controller';
import { MovieSessionController } from './controllers/movie-session.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_OPTIONS.JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
  ],
  controllers: [MovieController, MovieSessionController],
  providers: [MovieService, MovieSessionService, MovieDataAccess, MovieSessionDataAccess],
  exports: [MovieService, MovieSessionService],
})
export class MovieModule {}
