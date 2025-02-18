import { Injectable } from '@nestjs/common';
import { TicketDataAccess } from '../data-accesses/ticket.data-access';
import { PaginationFilterOptions } from '../../../common/interfaces/pagination';
import { CheckTicketParams, GetTickets, PatchTicket, PostTicket } from '../ticket.interface';
import { AggregateQueryParams, QueryParams } from '../../../common/interfaces/data-access';
import { TicketAlreadyExistsException, TicketNotFoundException } from '../../../common/errors';
import { TicketStatus } from '../ticket.enum';
import { SequenceService } from '../../../core/sequence/sequence.service';
import { SEQUENCES } from '../../../common/constants/sequences';

@Injectable()
export class TicketService {
  constructor(
    private readonly ticketDataAccess: TicketDataAccess,
    private readonly sequenceService: SequenceService,
  ) {}

  async getTickets(options: PaginationFilterOptions<GetTickets>) {
    return this.ticketDataAccess.getTickets(options);
  }

  async getTicketsByRawQuery(pipeline: AggregateQueryParams) {
    return this.ticketDataAccess.getTicketsByRawQuery(pipeline);
  }

  async getTicketById(ticketId: string, options: QueryParams) {
    options.filter = { _id: ticketId };
    return this.ticketDataAccess.getTicket(options);
  }

  async getTicket(ticket: string, options: QueryParams) {
    options.filter = { ticket };
    return this.ticketDataAccess.getTicket(options);
  }

  async createTicket(payload: PostTicket) {
    payload.status = payload.status || TicketStatus.Open;
    payload.ticketNumber = await this.sequenceService.getSequenceNextValue(SEQUENCES.TICKET_NUMBER);
    const ticket = await this.ticketDataAccess.createTicket(payload);
    return { id: ticket._id, ticketNumber: ticket.ticketNumber, movieDate: ticket.movieDate, status: ticket.status };
  }

  async updateTicket(ticketId: string, payload: PatchTicket) {
    await this.checkTicketExistence({ ticketId, mustExist: true });
    await this.ticketDataAccess.patchTicket(ticketId, payload);
    return true;
  }

  async deleteTicket(ticketId: string) {
    await this.checkTicketExistence({ ticketId, mustExist: true });
    await this.ticketDataAccess.deleteTicket(ticketId);
    return true;
  }

  async checkTicketExistence(params: CheckTicketParams) {
    const { ticketId, mustExist } = params;
    let ticket: any = {};
    if (ticketId) {
      ticket = await this.ticketDataAccess.getTicket({ filter: { _id: ticketId } });
    }
    if (mustExist) {
      if (!ticket) {
        throw new TicketNotFoundException();
      }
    } else {
      if (ticket) {
        throw new TicketAlreadyExistsException();
      }
    }
    return ticket;
  }
}
