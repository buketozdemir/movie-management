import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { BaseSuccessResponseDto } from '../../dtos/response';

export const ApiOkSuccessResponseDecorator = () => {
  return applyDecorators(
    ApiExtraModels(BaseSuccessResponseDto),
    ApiOkResponse({
      schema: {
        allOf: [{ $ref: getSchemaPath(BaseSuccessResponseDto) }],
      },
    }),
  );
};
