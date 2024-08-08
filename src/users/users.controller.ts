import { Body, Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AccessTokenGuard } from 'src/auth/accessToken.guard';
import {
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserInfo } from './dto/userInfo.dto';

@ApiTags('user 관련')
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: '유저 정보 API',
    description: '유저 정보를 얻습니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰을 포함한 인증 헤더입니다.',
    required: true,
    example: 'Bearer your_token_here',
  })
  @ApiOkResponse({
    description: '유저 정보',
    type: UserInfo,
  })
  @ApiUnauthorizedResponse({
    description:
      '유효하지 않은 토큰입니다. 다시 로그인 하십시오 | 인증 토큰이 없습니다.',
  })
  @ApiNotFoundResponse({
    description: '요청하신 정보를 찾을 수 없습니다.',
  })
  @UseGuards(AccessTokenGuard)
  async getUserInfo(@Request() req): Promise<UserInfo> {
    const user = await this.userService.findUserById(req.user.sub);

    return {
      name: user.name,
      email: user.email,
      point: user.point,
      rank: 10,
    };
  }
}
