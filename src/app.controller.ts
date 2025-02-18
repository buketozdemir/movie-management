import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  constructor() {}

  @Get('health')
  getHealth(): { time: number; status: string } {
    return { time: Date.now(), status: 'ok' };
  }
}
