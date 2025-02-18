import { applyDecorators, Patch } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { extractParams } from '../../utils';

export function PatchMethod(path?: string) {
  return applyDecorators(Patch(path), ...extractParams(path).map((p) => ApiParam({ name: p })));
}
