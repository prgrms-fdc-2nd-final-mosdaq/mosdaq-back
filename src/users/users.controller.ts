import {
  Controller,
  Get,
  UseGuards,
  Request,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AccessTokenGuard } from 'src/auth/accessToken.guard';
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserInfo } from './dto/userInfo.dto';
import { UserPollMovieListResponseDto } from './dto/user-poll-movie-list-response.dto';
import {
  SWAGGER_BAD_REQUERST_CONTENT,
  SWAGGER_INTERNAL_SERVER_ERROR_CONTENT,
} from 'src/constants';

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
    const userInfo = await this.userService.getUserInfo(req.user.sub);
    return {
      name: userInfo.name,
      email: userInfo.email,
      point: userInfo.point,
      rank: userInfo.rank,
    };
  }

  @Get('/poll')
  @ApiOperation({
    summary: '유저가 투표한 영화 목록 API',
    description: '유저가 투표한 투표 중 혹은 투표 마감된 영화 목록을 제공한다.',
  })
  @ApiQuery({
    name: 'poll',
    required: true,
    description: '투표 결과 필터링 여부 (true 또는 false)',
  })
  @ApiQuery({
    name: 'year',
    required: false,
    description: '영화 개봉 연도',
    example: new Date().getFullYear(),
  })
  @ApiOkResponse({
    description: '투표 중인 영화 목록을 제공한다.',
    type: UserPollMovieListResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      '쿼리 파라미터 형식을 맞추어주세요.\
      \n\n e.g) "/api/v1/users/poll?poll=true&year=2024"',
    content: SWAGGER_BAD_REQUERST_CONTENT,
  })
  @ApiInternalServerErrorResponse({
    description: '서버 내부 오류로 인해 영화 목록을 가져올 수 없습니다.',
    content: SWAGGER_INTERNAL_SERVER_ERROR_CONTENT,
  })
  async getUserPollMovies(
    @Query('poll', new DefaultValuePipe(true), ParseBoolPipe) poll: boolean,
    @Query('year', new DefaultValuePipe(new Date().getFullYear()), ParseIntPipe)
    year: number,
  ): Promise<UserPollMovieListResponseDto> {
    try {
      // TODO: request header에서 token 뽑아내기
      const userId: number | null = null;

      if (poll === true) {
        return this.userService.getUserPollingMovies(true, year, userId);
      } else if (poll === false) {
        return this.userService.getUserPolledMovies(false, year, userId);
      } else {
        // TODO: 에러 헨들링
        throw new Error('Invalid poll query parameter');
      }
    } catch (err) {
      // TODO: 에러 헨들링
      console.error('Error in /api/v1/movie/list?poll=true  : ', poll);
      throw err;
    }
  }
}
