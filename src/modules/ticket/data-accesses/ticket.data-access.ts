import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket, TicketDocument } from '../schemas/ticket.schema';
import { AggregateQueryParams, PaginatedQueryParams, QueryParams } from '../../../common/interfaces/data-access';
import { BaseDataAccess } from '../../../common/data-accesses/base-data-access';
import { PatchTicket, PostTicket } from '../ticket.interface';

@Injectable()
export class TicketDataAccess extends BaseDataAccess<TicketDocument> {
  constructor(@InjectModel(Ticket.name) private TicketModel: Model<TicketDocument>) {
    super(TicketModel);
  }

  async getTicket(params: QueryParams): Promise<any> {
    return this.findOne(params);
  }

  async getTickets(params: PaginatedQueryParams): Promise<any> {
    return this.get(params);
  }

  async getTicketsByRawQuery(params: AggregateQueryParams): Promise<any> {
    return this.aggregate(params);
  }

  async createTicket(payload: PostTicket): Promise<any> {
    return this.create(payload);
  }

  async patchTicket(ticketId: string, payload: PatchTicket): Promise<any> {
    return this.updateOne({ _id: ticketId }, payload);
  }

  async deleteTicket(ticketId: string): Promise<any> {
    return this.deleteOne({ _id: ticketId });
  }
}
