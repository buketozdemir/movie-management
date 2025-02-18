export interface GetTickets {
  user?: string;
  movie?: string;
  session?: string;
  ticketNumber?: number;
  status?: number;
}

export interface PostTicket {
  user: string;
  movie: string;
  session: string;
  ticketNumber?: number;
  price?: number;
  movieDate?: Date;
  status?: number;
  createdBy: string;
}

export interface PatchTicket {
  user?: string;
  movie?: string;
  session?: string;
  price?: number;
  ticketNumber?: number;
  movieDate?: Date;
  watchedAt?: Date;
  status?: number;
  updatedBy: string;
}

export interface CheckTicketParams {
  ticketId?: string;
  mustExist: boolean;
}
