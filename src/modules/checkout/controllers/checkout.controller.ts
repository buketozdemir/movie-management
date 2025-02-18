import { Body, Controller, Req, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TokenValidatorGuard } from '../../../common/guards';
import { CheckoutService } from '../services/checkout.service';
import { ApiOkResponseSchema, PostMethod, RateLimiter } from '../../../common/decorators/decorators';
import { BaseErrorResponseDto, BaseResponseDto, BaseSuccessResponseDto, ValidationErrorResponseDto } from '../../../common/dtos/response';
import { PostCheckoutRequestDto } from '../dtos/request';
import { RequestWithHeader } from '../../../common/interfaces/header';

@ApiTags('checkout')
@Controller('checkout')
@RateLimiter()
@ApiBearerAuth()
@UseGuards(TokenValidatorGuard)
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @PostMethod()
  @ApiOperation({ summary: 'Create a checkout' })
  @ApiOkResponseSchema(BaseSuccessResponseDto)
  @ApiBadRequestResponse({ type: ValidationErrorResponseDto, description: 'Validation Error' })
  @ApiNotFoundResponse({ type: BaseErrorResponseDto, description: 'User || Movie || Session Not Found Error' })
  @ApiForbiddenResponse({ type: BaseErrorResponseDto, description: 'Forbidden Error' })
  async createCheckoutController(@Body() payload: PostCheckoutRequestDto, @Req() req: RequestWithHeader): Promise<BaseResponseDto> {
    const result = await this.checkoutService.checkout({ userId: req.user.id, ...payload });
    return new BaseResponseDto(result);
  }
}
