import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto<T = any> {
  @ApiProperty({ example: 'success', default: 'success' })
  message: string;

  data: T;

  actions?: any[];

  constructor(_data?: any, _actions?: any[], _message?: string) {
    this.data = _data;
    this.actions = _actions || [];
    this.message = _message || 'success';
  }
}
