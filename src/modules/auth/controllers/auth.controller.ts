import { Body, Controller, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHeaderMeta } from '../../../common/decorators/decorators/api-header-meta.decorator';
import { AuthService } from '../services/auth.service';
import { PostMethod, RateLimiter } from '../../../common/decorators/decorators';
import { RefreshTokenValidatorGuard, TokenValidatorGuard } from '../../../common/guards';
import { BaseResponseDto } from '../../../common/dtos/response';
import { RequestWithHeader } from '../../../common/interfaces/header';
import { AccessTokenPostDto, LoginPostDto, SignUpPostDto } from '../dtos/request';
import RATE_LIMITS from '../../../common/constants/rate-limits';

@Controller('auth')
@ApiTags('auth')
@ApiHeaderMeta()
export class AuthController {
  constructor(private authService: AuthService) {}

  @PostMethod('login')
  @RateLimiter(RATE_LIMITS.LOGIN)
  @ApiOperation({ summary: 'Login user' })
  async loginController(@Body() payload: LoginPostDto): Promise<BaseResponseDto> {
    const result = await this.authService.login(payload);
    return new BaseResponseDto(result);
  }

  @PostMethod('signup')
  @ApiOperation({ summary: 'Create a new user by signup process' })
  async signUpController(@Body() payload: SignUpPostDto, @Req() req: RequestWithHeader): Promise<BaseResponseDto> {
    const result = await this.authService.signUp(payload);
    return new BaseResponseDto(result);
  }

  @PostMethod('logout')
  @ApiOperation({ summary: 'User logout' })
  @UseGuards(TokenValidatorGuard)
  @ApiBearerAuth()
  async logoutController(@Req() req: RequestWithHeader): Promise<BaseResponseDto> {
    const result = await this.authService.logout(req.publicKey);
    return new BaseResponseDto(result);
  }

  @PostMethod('access-token')
  @RateLimiter(RATE_LIMITS.REFRESH_TOKEN)
  @ApiOperation({ summary: 'Get a new access token by refresh token' })
  @ApiBearerAuth()
  @UseGuards(RefreshTokenValidatorGuard)
  async accessTokenViaRefreshTokenController(@Body() payload: AccessTokenPostDto, @Req() req: RequestWithHeader): Promise<BaseResponseDto> {
    const result = await this.authService.accessToken({ publicKey: req.publicKey, ...{ user: req.user } }, payload);
    return new BaseResponseDto(result);
  }
}
