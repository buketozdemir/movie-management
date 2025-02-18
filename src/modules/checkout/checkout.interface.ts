export interface CheckoutParams {
  movieId: string;
  sessionId: string;
  userId: string;
}

export interface CheckoutValidationsParams {
  movie: CheckoutMovie;
  session: CheckoutSession;
  user: CheckoutUser;
  ticketCount: number;
  roomCapacity: number;
}

interface CheckoutUser {
  id: string;
  birthDate: Date;
}

interface CheckoutMovie {
  id: string;
  status: number;
  ageRestriction: number;
}

interface CheckoutSession {
  id: string;
  status: number;
  startTime: Date;
  price: number;
}
