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
import { PollingMovieListDto } from './dto/polling-movie-list-response.dto';
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
    type: PollingMovieListDto,
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
  /** TODO:
   * 1. pipe를 통한 query 파라미터에서 뽑아낸 데이터 검증
   * 2. pipe에서 뽑은 데이터 service로 전달
   * 3. service
   *    - entity 명시
   *    - entity 이용하여 DB에서 필요한 데이터 가져오기
   * 4. service에서 응답 메시지 구성하여 return
   * etc
   * - controller
   *   - req 파라미터 타입 명시
   *   - response 타입 명시
   * - exception
   * - logger
   */
  // /api/v1/movie/list?poll=true&offset={}&limit={}&sort={}
  // TODO: response type 명시
  @UsePipes(ValidationPipe)
  async pollMovieList(
    @Query('poll', new DefaultValuePipe(true), ParseBoolPipe) poll: boolean,
    @Query('offset', new DefaultValuePipe(1), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(30), ParseIntPipe) limit: number,
    @Query('sort', new DefaultValuePipe('DESC'))
    sort: 'DESC' | 'ASC',
    @Req() req: unknown,
  ) {
    try {
      if (poll === true) {
        // TODO: query 파라미터 검증, 데이터 뽑아내기
        // TODO: pagination, sorting
        return this.movieListService.getPollingMovies(offset, limit, sort);
      } else if (poll === false) {
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
