import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export default class UserFormatter {
  logger = new Logger(UserFormatter.name);
}
