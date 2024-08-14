import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseBoolPipe,
  ParseIntPipe,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MovieListService } from './movie-list.service';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PollMovieListResponseDto } from './dto/poll-movie-list-response.dto';
import {
  SWAGGER_BAD_REQUERST_CONTENT,
  SWAGGER_INTERNAL_SERVER_ERROR_CONTENT,
} from 'src/constants';

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
    type: PollMovieListResponseDto,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description:
      '쿼리 파라미터 형식을 맞추어주세요.\
      \n\n e.g) "/api/v1/movie/list?poll=true&offset=5&limit=1&sort=ASC"',
    content: SWAGGER_BAD_REQUERST_CONTENT,
  })
  @ApiInternalServerErrorResponse({
    description: '서버 내부 오류로 인해 영화 목록을 가져올 수 없습니다.',
    content: SWAGGER_INTERNAL_SERVER_ERROR_CONTENT,
  })
  // TODO: query parameter 검증 로직, 커스텀으로 변경 및 자체 에러코드 설정
  @UsePipes(ValidationPipe)
  // TODO: 매직 넘버 상수 변수로 대체
  async pollMovieList(
    @Query('poll', new DefaultValuePipe(true), ParseBoolPipe) poll: boolean,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit: number,
    @Query('sort', new DefaultValuePipe('DESC'))
    sort: 'DESC' | 'ASC',
    @Req() request: Request,
  ): Promise<PollMovieListResponseDto> {
    try {
      // TODO: request header에서 token 뽑아내기
      const userId = null;

      if (poll === true) {
        return this.movieListService.getPollingMovies(
          true,
          offset,
          limit,
          sort,
          userId,
        );
      } else if (poll === false) {
        return this.movieListService.getPollingMovies(
          false,
          offset,
          limit,
          sort,
          userId,
        );
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
