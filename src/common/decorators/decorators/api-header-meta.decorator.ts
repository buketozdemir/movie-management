import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
import { DeviceType } from '../../enums';

export function ApiHeaderMeta() {
  return applyDecorators(
    ApiHeader({ name: 'language', description: 'Language parameter', example: 'tr' }),
    ApiHeader({ name: 'device-id', description: 'Device Information' }),
    ApiHeader({ name: 'device-type', enum: DeviceType, description: 'Device type' }),
    ApiHeader({ name: 'ip-address', description: 'IP Address' }),
  );
}
