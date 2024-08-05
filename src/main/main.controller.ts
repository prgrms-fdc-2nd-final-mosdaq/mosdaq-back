import { Controller, Get, Query } from '@nestjs/common';
import { MainService } from './main.service';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('api/v1/main-movie')
@ApiTags('대표 영화 api')
export class MainController {
  constructor(private mainService: MainService) {}

  @Get('/')
  @ApiOperation({
    summary: '대표 영화 제공 API',
    description:
      '인기 영화 5개를 선정하여 영화 데이터 및 개봉 4주 전, 4주 후 주가 데이터를 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description:
      '인기 영화 5개를 선정하여 영화 데이터 및 개봉 4주 전, 4주 후 주가 데이터를 반환합니다.',
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
  async mainMovie() {
    return this.mainService.getMainMovies();
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
    description: '성공적으로 투표 중인 영화를 반환했습니다.',
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
            },
          },
        },
        movieListCount: { type: 'number' },
      },
    },
  })
  async popularPollingMovies(@Query('poll') poll: string) {
    if (poll === 'true') {
      return this.mainService.getPopularPollingMovies();
    }
    // TODO: poll === 'false'
    return { message: 'Invalid query parameter' };
  }
}
