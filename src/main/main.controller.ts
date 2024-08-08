import { Controller, Get, Query, Req } from '@nestjs/common';
import { MainService } from './main.service';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

@Controller('api/v1/main-movie')
@ApiTags('메인 페이지 영화 api')
export class MainController {
  constructor(private readonly mainService: MainService) {}

  @Get('/')
  @ApiOperation({
    summary: '대표 영화 제공 API',
    description:
      '대표 영화 5개의 영화 데이터 및 개봉 4주 전, 4주 후 주가 데이터 요청',
  })
  @ApiOkResponse({
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
  @ApiNotFoundResponse({
    description: '요청하신 정보를 찾을 수 없습니다.',
  })
  @ApiInternalServerErrorResponse({
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
  @ApiOkResponse({
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
  @ApiNotFoundResponse({
    description: '요청하신 정보를 찾을 수 없습니다.',
  })
  @ApiInternalServerErrorResponse({
    description: '서버 내부 오류로 인해 영화 목록을 가져올 수 없습니다.',
  })
  // TODO: @Req() req: any => @Req() req: Request  req.user 데이터 타입을 모르는 이슈 발생
  async popularPollingMovies(@Query('poll') poll: string, @Req() req: any) {
    try {
      const userId = req.user ? req.user.id : null;
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
