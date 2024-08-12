import { Controller, Get, Query, Req } from '@nestjs/common';
import { MovieListService } from './movie-list.service';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
// import { CreateMovieListDto } from './dto/create-movie-list.dto';

@Controller('api/v1/movie/list')
@ApiTags('영화 투표 목록 api')
export class MovieListController {
  constructor(private readonly movieListService: MovieListService) {}

  // /api/v1/movie/list?poll=true&offset={}&limit={}&sort={}
  @Get('/')
  @ApiOperation({
    summary: '투표 중인 영화 목록 API',
    description:
      '투표 중인 영화 목록을 제공한다.\
      \n 페이지네이션과 개봉일 기준 오름차순, 내림차순 정렬 등의 조건을 \
      query param을 통해 설정 할 수 있다.',
  })
  // TODO: schema는 별도 파일로 모듈화
  @ApiOkResponse({
    description: '투표 중인 영화 목록을 제공한다.',
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
              afterPrice: { type: 'number' },
              beforePriceDate: { type: 'string', format: 'date' },
              afterPriceDate: { type: 'string', format: 'date' },
            },
          },
        },
        movieListCount: { type: 'number' },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: '서버 내부 오류로 인해 영화 목록을 가져올 수 없습니다.',
  })
  async pollMovieList(@Query('poll') poll: string, @Req() req: unknown) {
    try {
      if (poll === 'true') {
        return this.movieListService.getPollingMovies();
      } else if (poll === 'false') {
        return '/api/v1/movie/list?poll=false';
      } else {
        throw new Error('Invalid poll query parameter');
      }
    } catch (err) {
      console.error('Error in /api/v1/movie/list?poll=true  : ', poll);
      throw err;
    }
  }
}
