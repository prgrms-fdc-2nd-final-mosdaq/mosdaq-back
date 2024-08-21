import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseBoolPipe,
  ParseIntPipe,
  Query,
  UseGuards,
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
import {
  MOVIE_LIST_DEFAULT_LIMIT,
  MOVIE_LIST_DEFAULT_OFFSET,
  MOVIE_LIST_DEFAULT_SORT,
} from 'src/constants/app.constants';
import { User } from 'src/users/users.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/JwtAuth.guard';
import { JwtUserDto } from 'src/users/dto/JwtUser.dto';

@Controller('api/v1/movie/list')
@ApiTags('영화 투표 목록 api')
export class MovieListController {
  constructor(private readonly movieListService: MovieListService) {}

  @Get('/')
  @ApiOperation({
    summary: '투표 중인 영화 목록 API',
    description:
      '투표 중인 영화 목록을 제공한다.\
      \n 페이지네이션과 개봉일 기준 오름차순, 내림차순 정렬 등의 조건을 \
      query param을 통해 설정 할 수 있다.',
  })
  @ApiQuery({
    name: 'poll',
    required: true,
    description: '투표 결과 필터링 여부',
  })
  @ApiQuery({ name: 'offset', required: false, description: '결과의 오프셋' })
  @ApiQuery({ name: 'limit', required: false, description: '결과의 제한 수' })
  @ApiQuery({
    name: 'sort',
    required: false,
    description: '정렬 순서 (ASC 또는 DESC)',
  })
  // TODO: schema vs type: DTO 어느 방식이 적절할지 조사
  @ApiOkResponse({
    description: '투표 중인 영화 목록을 제공한다.',
    type: PollMovieListResponseDto,
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
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async pollMovieList(
    @Query('poll', new DefaultValuePipe(true), ParseBoolPipe) poll: boolean,
    @Query(
      'offset',
      new DefaultValuePipe(MOVIE_LIST_DEFAULT_OFFSET),
      ParseIntPipe,
    )
    offset: number,
    @Query(
      'limit',
      new DefaultValuePipe(MOVIE_LIST_DEFAULT_LIMIT),
      ParseIntPipe,
    )
    limit: number,
    @Query('sort', new DefaultValuePipe(MOVIE_LIST_DEFAULT_SORT))
    sort: 'DESC' | 'ASC',
    @User() user: JwtUserDto | null,
  ): Promise<PollMovieListResponseDto> {
    const userId = user?.sub ? user.sub : null;

    return this.movieListService.getPollMovies(
      poll,
      offset,
      limit,
      sort,
      userId,
    );
  }
}
