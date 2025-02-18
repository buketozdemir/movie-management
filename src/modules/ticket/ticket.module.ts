import { Module } from '@nestjs/common';
import { TicketController } from './controllers/ticket.controller';
import { TicketService } from './services/ticket.service';
import { TicketDataAccess } from './data-accesses/ticket.data-access';
import { Ticket, TicketSchema } from './schemas/ticket.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import SequenceModule from '../../core/sequence/sequence.module';

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
    SequenceModule,
    MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
  ],
  controllers: [TicketController],
  providers: [TicketService, TicketDataAccess],
  exports: [TicketService],
})
export class TicketModule {}
