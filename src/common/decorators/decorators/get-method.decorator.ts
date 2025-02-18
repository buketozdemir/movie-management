import { applyDecorators, Get, UseInterceptors } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { extractParams } from '../../utils';
import { PaginationInterceptor } from '../../interceptors';

export function GetMethod(path?: string) {
  return applyDecorators(Get(path), UseInterceptors(new PaginationInterceptor(path)), ...extractParams(path).map((p) => ApiParam({ name: p })));
}
