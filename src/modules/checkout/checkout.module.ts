import { Module } from '@nestjs/common';
import { CheckoutController } from './controllers/checkout.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CheckoutService } from './services/checkout.service';
import { TicketModule } from '../ticket/ticket.module';
import { MovieModule } from '../movie/movie.module';
import { UserModule } from '../user/user.module';
import { RoomModule } from '../room/room.module';

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
    UserModule,
    TicketModule,
    MovieModule,
    RoomModule,
  ],
  controllers: [CheckoutController],
  providers: [CheckoutService],
  exports: [],
})
export class CheckoutModule {}
