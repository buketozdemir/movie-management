import { Module } from '@nestjs/common';
import { UserMovieController } from './controllers/user-movie.controller';
import { UserMovieService } from './services/user-movie.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MovieModule } from '../movie/movie.module';
import { TicketModule } from '../ticket/ticket.module';

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
    MovieModule,
    TicketModule,
  ],
  controllers: [UserMovieController],
  providers: [UserMovieService],
  exports: [UserMovieService],
})
export class UserMovieModule {}
