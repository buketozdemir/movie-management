import { Module } from '@nestjs/common';
import configs from './config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import MongoModule from './core/mongo/mongoose.module';
import RedisCacheModule from './core/redis/redis-cache.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MovieModule } from './modules/movie/movie.module';
import { RoomModule } from './modules/room/room.module';
import SequenceModule from './core/sequence/sequence.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { CheckoutModule } from './modules/checkout/checkout.module';
import { UserMovieModule } from './modules/user-movie/user-movie.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configs],
    }),
    EventEmitterModule.forRoot(),
    MongoModule,
    RedisCacheModule,
    SequenceModule,
    AuthModule,
    UserModule,
    MovieModule,
    RoomModule,
    TicketModule,
    CheckoutModule,
    UserMovieModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
