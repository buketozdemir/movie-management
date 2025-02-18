import { applyDecorators, Put } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { extractParams } from '../../utils';

export function PutMethod(path?: string) {
  return applyDecorators(Put(path), ...extractParams(path).map((p) => ApiParam({ name: p })));
}
