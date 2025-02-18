import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { BaseResponseDto, PaginatedResponseDto } from '../../dtos/response';

export const ApiOkPostResponseSchema = <DataDto extends Type<unknown>>(type: DataDto | any, isArray = false, isPagination = false) => {
  return applyDecorators(
    ApiExtraModels(isPagination ? PaginatedResponseDto : BaseResponseDto, type),
    ApiResponse({
      status: 201,
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
