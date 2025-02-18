import { Body, Controller, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import {
  BaseResponseDto,
  BaseErrorResponseDto,
  PaginatedResponseDto,
  ValidationErrorResponseDto,
  BasePatchResponseDto,
  BaseDeleteResponseDto,
  BasePostResponseDto,
} from '../../../common/dtos/response';
import { ApiOkResponseSchema, DeleteMethod, GetMethod, ObjectIdParam, PatchMethod, PostMethod, RateLimiter } from '../../../common/decorators/decorators';
import {
  DeleteUserRequestDto,
  GetUserRequestDto,
  GetUsersRequestDto,
  PatchUserRequestDto,
  PostChangePasswordRequestDto,
  PostUserRequestDto,
} from '../dtos/request';
import { GetUserResponseDto, PostUserResponseDto } from '../dtos/response';
import { TokenValidatorGuard, UserOwnValidatorGuard } from '../../../common/guards';
import { RequestWithHeader } from '../../../common/interfaces/header';

@ApiTags('user')
@Controller('users')
@RateLimiter()
@ApiBearerAuth()
@UseGuards(TokenValidatorGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GetMethod()
  @ApiOperation({ summary: 'Get users' })
  @ApiOkResponseSchema(GetUserResponseDto, true, true)
  async getUsersController(@Query() query: GetUsersRequestDto, @Req() req: RequestWithHeader): Promise<BaseResponseDto> {
    const { status, userName, firstName, lastName, page, limit, sortOrder, sort, projection } = query;
    const result = await this.userService.getUsers({
      filter: { status, userName, firstName, lastName },
      page,
      limit,
      sortOrder,
      sort,
      projection,
    });
    return new PaginatedResponseDto(result);
  }

  @GetMethod(':userId')
  @ApiOperation({ summary: 'Get the user' })
  @UseGuards(UserOwnValidatorGuard)
  @ApiOkResponseSchema(GetUserResponseDto)
  async getUserController(@ObjectIdParam('userId') userId: string, @Query() query: GetUserRequestDto, @Req() req: RequestWithHeader): Promise<BaseResponseDto> {
    const result = await this.userService.getUserById(userId, query);
    return new BaseResponseDto(result);
  }

  @PostMethod()
  @ApiOperation({ summary: 'Create an user' })
  @ApiOkResponseSchema(PostUserResponseDto)
  @ApiBadRequestResponse({ type: ValidationErrorResponseDto, description: 'Validation Error' })
  async createUserController(@Body() payload: PostUserRequestDto, @Req() req: RequestWithHeader): Promise<BaseResponseDto> {
    const result = await this.userService.createUser(payload);
    return new BaseResponseDto(result);
  }

  @PatchMethod(':userId')
  @UseGuards(UserOwnValidatorGuard)
  @ApiOperation({ summary: 'Update the user' })
  @ApiOkResponse({ type: BasePatchResponseDto, description: 'User Updated Successfully' })
  @ApiNotFoundResponse({ type: BaseErrorResponseDto, description: 'User Not Found Error' })
  @ApiBadRequestResponse({ type: ValidationErrorResponseDto, description: 'Validation Error' })
  async updateUserController(
    @ObjectIdParam('userId') userId: string,
    @Body() payload: PatchUserRequestDto,
    @Req() req: RequestWithHeader,
  ): Promise<BaseResponseDto> {
    const result = await this.userService.updateUser(userId, payload);
    return new BaseResponseDto(result);
  }

  @PostMethod(':userId/change-password')
  @UseGuards(UserOwnValidatorGuard)
  @ApiOperation({ summary: 'Change the user password' })
  @ApiOkResponse({ type: BasePostResponseDto, description: 'Password Updated Successfully' })
  @ApiNotFoundResponse({ type: BaseErrorResponseDto, description: 'User Not Found Error' })
  @ApiBadRequestResponse({ type: ValidationErrorResponseDto, description: 'Validation Error' })
  async changePasswordController(
    @ObjectIdParam('userId') userId: string,
    @Body() payload: PostChangePasswordRequestDto,
    @Req() req: RequestWithHeader,
  ): Promise<BaseResponseDto> {
    const result = await this.userService.changePassword(userId, payload);
    return new BaseResponseDto(result);
  }

  @DeleteMethod(':userId')
  @ApiOperation({ summary: 'Delete the user' })
  @ApiOkResponse({ type: BaseDeleteResponseDto, description: 'User Deleted Successfully' })
  @ApiNotFoundResponse({ type: BaseErrorResponseDto, description: 'User Not Found Error' })
  @ApiBadRequestResponse({ type: ValidationErrorResponseDto, description: 'Validation Error' })
  async deleteUserController(
    @ObjectIdParam('userId') userId: string,
    @Body() payload: DeleteUserRequestDto,
    @Req() req: RequestWithHeader,
  ): Promise<BaseResponseDto> {
    const result = await this.userService.deleteUser(userId, payload);
    return new BaseResponseDto(result);
  }
}
