import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { BaseResponseDto, PaginatedResponseDto } from '../../dtos/response';

export const ApiOkResponseSchema = <DataDto extends Type<unknown>>(type: DataDto | any, isArray = false, isPagination = false) => {
  return applyDecorators(
    ApiExtraModels(isPagination ? PaginatedResponseDto : BaseResponseDto, type),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(isPagination ? PaginatedResponseDto : BaseResponseDto) },
          {
            properties: {
              data: isArray
                ? {
                    type: 'array',
                    items: { $ref: getSchemaPath(type) },
                  }
                : { $ref: getSchemaPath(type) },
            },
          },
        ],
      },
    }),
  );
};
