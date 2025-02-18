import { applyDecorators, Delete } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { extractParams } from '../../utils';

export function DeleteMethod(path?: string) {
  return applyDecorators(Delete(path), ...extractParams(path).map((p) => ApiParam({ name: p })));
}
