import { applyDecorators, Post } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { extractParams } from '../../utils';

export function PostMethod(path?: string) {
  return applyDecorators(Post(path), ...extractParams(path).map((p) => ApiParam({ name: p })));
}
