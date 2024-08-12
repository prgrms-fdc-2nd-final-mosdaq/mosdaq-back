import { Controller, Get, Query, Req } from '@nestjs/common';
import { MovieListService } from './movie-list.service';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PollingMovieListDto } from './dto/polling-movie-list-response.dto';

@Controller('api/v1/movie/list')
@ApiTags('영화 투표 목록 api')
export class MovieListController {
  constructor(private readonly movieListService: MovieListService) {}

  // /api/v1/movie/list?poll=true&offset={}&limit={}&sort={}
  @Get('/')
  @ApiQuery({
    name: 'poll',
    required: true,
    description: '투표 결과 필터링 여부',
  })
  // required 조건 고려
  @ApiQuery({ name: 'offset', required: false, description: '결과의 오프셋' })
  @ApiQuery({ name: 'limit', required: false, description: '결과의 제한 수' })
  @ApiQuery({
    name: 'sort',
    required: false,
    description: '정렬 순서 (ASC 또는 DESC)',
  })
  @ApiOperation({
    summary: '투표 중인 영화 목록 API',
    description:
      '투표 중인 영화 목록을 제공한다.\
      \n 페이지네이션과 개봉일 기준 오름차순, 내림차순 정렬 등의 조건을 \
      query param을 통해 설정 할 수 있다.',
  })
  // TODO: schema vs type: DTO 어느 방식이 적절할지 조사
  @ApiOkResponse({
    description: '투표 중인 영화 목록을 제공한다.',
    type: PollingMovieListDto,
    isArray: true,
  })
  // TODO: swagger 에러 문구 모듈화
  @ApiBadRequestResponse({
    description:
      '쿼리 파라미터 형식을 맞추어주세요.\
      \n\n e.g) "/api/v1/movie/list?poll=true&offset=5&limit=1&sort=ASC"',
    content: {
      'application/json': {
        example: {
          message: '잘못된 요청입니다.',
        },
      },
    },
  })
  // TODO: swagger 에러 문구 모듈화
  @ApiInternalServerErrorResponse({
    description: '서버 내부 오류로 인해 영화 목록을 가져올 수 없습니다.',
    content: {
      'application/json': {
        example: {
          message: '서버 내부 오류',
        },
      },
    },
  })
  // TODO: response type 명시
  async pollMovieList(@Query('poll') poll: string, @Req() req: unknown) {
    try {
      if (poll === 'true') {
        // TODO: query 파라미터 검증, 데이터 뽑아내기
        // TODO: pagination, sorting
        return this.movieListService.getPollingMovies();
      } else if (poll === 'false') {
        // TODO: 투표 마감된 영화 목록
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
