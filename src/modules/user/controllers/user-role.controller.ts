import { Body, Controller, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import {
  BaseResponseDto,
  BaseErrorResponseDto,
  PaginatedResponseDto,
  ValidationErrorResponseDto,
  BasePatchResponseDto,
  BaseDeleteResponseDto,
  BasePutResponseDto,
} from '../../../common/dtos/response';
import { ApiOkResponseSchema, DeleteMethod, GetMethod, ObjectIdParam, PutMethod, RateLimiter } from '../../../common/decorators/decorators';
import { RequestWithHeader } from '../../../common/interfaces/header';
import { DeleteUserRoleRequestDto, PutUserRoleRequestDto } from '../dtos/request';
import { GetUserRolesResponseDto, PostUserResponseDto } from '../dtos/response';
import { UserRoleService } from '../services/user-role.service';
import { TokenValidatorGuard } from '../../../common/guards';

@ApiTags('users-role')
@Controller('users')
@ApiBearerAuth()
@UseGuards(TokenValidatorGuard)
@RateLimiter()
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @GetMethod(':userId/roles')
  @ApiOperation({ summary: 'Get the user roles' })
  @ApiOkResponseSchema(GetUserRolesResponseDto)
  @ApiNotFoundResponse({ type: BaseErrorResponseDto, description: 'User Not Found Error' })
  @ApiBadRequestResponse({ type: ValidationErrorResponseDto, description: 'Validation Error' })
  async getUserRolesController(@ObjectIdParam('userId') userId: string, @Req() req: RequestWithHeader): Promise<BaseResponseDto> {
    const result = await this.userRoleService.getRolesOfUser(userId);
    return new BaseResponseDto(result);
  }

  @PutMethod(':userId/roles')
  @ApiOperation({ summary: 'Add a role to the user' })
  @ApiOkResponse({ type: BasePutResponseDto, description: 'Role Added Successfully' })
  @ApiOkResponseSchema(PostUserResponseDto)
  @ApiNotFoundResponse({ type: BaseErrorResponseDto, description: 'User Not Found Error' })
  @ApiConflictResponse({ type: BaseErrorResponseDto, description: 'User Role Already Exists' })
  @ApiBadRequestResponse({ type: ValidationErrorResponseDto, description: 'Validation Error' })
  async addRoleToUserController(
    @ObjectIdParam('userId') userId: string,
    @Body() payload: PutUserRoleRequestDto,
    @Req() req: RequestWithHeader,
  ): Promise<BaseResponseDto> {
    const result = await this.userRoleService.addRoleToUser(userId, payload.roleId);
    return new BaseResponseDto(result);
  }

  @DeleteMethod(':userId/roles/:roleId')
  @ApiOperation({ summary: 'Delete the role from the user' })
  @ApiOkResponse({ type: BaseDeleteResponseDto, description: 'User Role Deleted Successfully' })
  @ApiNotFoundResponse({ type: BaseErrorResponseDto, description: 'User Not Found Error or User Role Not Found Error' })
  @ApiBadRequestResponse({ type: ValidationErrorResponseDto, description: 'Validation Error' })
  async deleteUserRoleController(
    @ObjectIdParam('userId') userId: string,
    @ObjectIdParam('roleId') roleId: number,
    @Body() payload: DeleteUserRoleRequestDto,
    @Req() req: RequestWithHeader,
  ): Promise<BaseResponseDto> {
    const result = await this.userRoleService.deleteRoleFromUser(userId, roleId, payload, req);
    return new BaseResponseDto(result);
  }
}
