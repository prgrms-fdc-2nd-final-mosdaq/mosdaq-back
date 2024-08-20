import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { MainService } from './main.service';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/JwtAuth.guard';
import { JwtUserDto } from 'src/users/dto/JwtUser.dto';
import { User } from 'src/users/users.decorator';

@Controller('api/v1/main-movie')
@ApiTags('대표 영화 api')
export class MainController {
  constructor(private readonly mainService: MainService) {}

  @Get('/')
  @ApiOperation({
    summary: '대표 영화 제공 API',
    description:
      '대표 영화 5개의 영화 데이터 및 개봉 4주 전, 4주 후 주가 데이터 요청',
  })
  @ApiResponse({
    status: 200,
    description:
      '서비스 운영자가 선정한 영화 5개의 영화 데이터 및 개봉 4주 전, 4주 후 주가 데이터와 함께 반환합니다.',
    schema: {
      type: 'object',
      properties: {
        movieList: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              movieId: { type: 'number' },
              movieTitle: { type: 'string' },
              posterUrl: { type: 'string' },
              countryCode: { type: 'string' },
              beforePrice: { type: 'number' },
              afterPrice: { type: 'number' },
              beforePriceDate: { type: 'string', format: 'date-time' },
              afterPriceDate: { type: 'string', format: 'date-time' },
            },
          },
        },
        movieListCount: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: '서버 내부 오류로 인해 영화 목록을 가져올 수 없습니다.',
  })
  async mainMovie() {
    // TOOD: 에러 핸들링
    return await this.mainService.getMainMovies();
  }

  @Get('/poll')
  @ApiOperation({
    summary: '투표 중인 영화 목록 API',
    description:
      '투표 중인 영화들 중에서 투표 횟수가 많은 순서로 5개의 영화를 반환합니다.',
  })
  @ApiQuery({
    name: 'poll',
    required: true,
    type: 'string',
    description: '투표 활성화 여부 (true)',
  })
  @ApiResponse({
    status: 200,
    description: '성공적으로 투표 중인 영화 목록을 반환했습니다.',
    schema: {
      type: 'object',
      properties: {
        movieList: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              movieId: { type: 'number' },
              movieTitle: { type: 'string' },
              posterUrl: { type: 'string' },
              up: { type: 'number' },
              down: { type: 'number' },
              pollCount: { type: 'number' },
              myPollResult: { type: 'string', nullable: true },
            },
          },
        },
        movieListCount: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: '서버 내부 오류로 인해 영화 목록을 가져올 수 없습니다.',
  })
  @UseGuards(JwtAuthGuard)
  // TODO: @Req() req: any => @Req() req: Request  req.user 데이터 타입을 모르는 이슈 발생
  async popularPollingMovies(
    @Query('poll') poll: string,
    @User() user: JwtUserDto | null,
  ) {
    try {
      const userId = user?.sub ? user.sub : null;
      console.log(user);
      if (poll === 'true') {
        return await this.mainService.getPopularMoviesPolling(userId);
      } else if (poll === 'false') {
        return await this.mainService.getPopularMoviesPolled();
      } else {
        throw new Error('Invalid poll query parameter');
      }
    } catch (err) {
      console.error('Error in popularPollingMovies:', err);
      throw err;
    }
  }
}
