import { movieModel, roomModel, sequenceModel, ticketModel, userModel } from '../core/mongo/models';
import { UserDataAccess } from '../../src/modules/user/data-accesses/user.data-access';
import { RedisCacheService } from '../../src/core/redis/redis-cache.service';
import { MockRedisCacheService } from '../core/redis';
import { MongoConnection } from '../core/mongo';
import { MovieDataAccess } from '../../src/modules/movie/data-accesses/movie.data-access';
import { MovieSessionDataAccess } from '../../src/modules/movie/data-accesses/movie-session.data-access';
import { RoomDataAccess } from '../../src/modules/room/data-accesses/room.data-access';
import { SequenceService } from '../../src/core/sequence/sequence.service';
import { TicketDataAccess } from '../../src/modules/ticket/data-accesses/ticket.data-access';
import { AuthService } from '../../src/modules/auth/services/auth.service';
import { CheckoutService } from '../../src/modules/checkout/services/checkout.service';
import { MovieService } from '../../src/modules/movie/services/movie.service';
import { MovieSessionService } from '../../src/modules/movie/services/movie-session.service';
import { RoomService } from '../../src/modules/room/services/room.service';
import { TicketService } from '../../src/modules/ticket/services/ticket.service';
import { UserService } from '../../src/modules/user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CustomRateLimiter, TokenValidatorGuard, UserOwnValidatorGuard } from '../../src/common/guards';
import { UserMovieService } from '../../src/modules/user-movie/services/user-movie.service';

export class Configs {
  static async initial(): Promise<any> {
    const redisCacheService = new MockRedisCacheService();
    const mongoConnection = new MongoConnection();
    await mongoConnection.init();
    return {
      redisCacheService,
      mongoConnection,
      providers: [
        {
          provide: MovieDataAccess,
          useFactory: () => new MovieDataAccess(movieModel(mongoConnection)),
        },
        {
          provide: MovieSessionDataAccess,
          useFactory: () => new MovieSessionDataAccess(movieModel(mongoConnection)),
        },
        {
          provide: RoomDataAccess,
          useFactory: () => new RoomDataAccess(roomModel(mongoConnection)),
        },
        {
          provide: SequenceService,
          useFactory: () => new SequenceService(sequenceModel(mongoConnection)),
        },
        {
          provide: TicketDataAccess,
          useFactory: () => new TicketDataAccess(ticketModel(mongoConnection)),
        },
        {
          provide: UserDataAccess,
          useFactory: () => new UserDataAccess(userModel(mongoConnection)),
        },
        AuthService,
        CheckoutService,
        MovieService,
        MovieSessionService,
        RoomService,
        TicketService,
        UserService,
        UserMovieService,
        {
          provide: JwtService,
          useFactory: async (configService: ConfigService) => {
            return new JwtService({
              secret: configService.get<string>('JWT_OPTIONS.JWT_SECRET'),
              global: true,
            });
          },
          inject: [ConfigService],
        },
        {
          provide: RedisCacheService,
          useValue: redisCacheService,
        },
        UserOwnValidatorGuard,
        CustomRateLimiter,
        TokenValidatorGuard,
      ],
    };
  }
}
