import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { MovieDetailService } from './movie-detail.service';
import { MovieDetailDto } from './dto/movie-detail.dto';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Controller('api/v1/movie/detail/')
@ApiTags('영화 상세 정보 조회 api')
export class MovieDetailController {
  constructor(private readonly movieDetailService: MovieDetailService) {}

  @Get(':id')
  @ApiOperation({
    summary: '영화 상세 정보 제공 api',
    description: 'movie-id 값으로 상세 정보 제공',
  })
  @ApiOkResponse({
    status: 200,
    description: '영화 id에 맞는 정보를 제공합니다.',
    schema: {
      type: 'object',
      properties: {
        movieTitle: { type: 'string' },
        movieDirector: { type: 'string' },
        movieOpenDate: { type: 'string' },
        movieDescription: { type: 'string' },
        posterUrl: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        companyName: { type: 'string' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: '요청하신 정보를 찾을 수 없습니다.',
  })
  @ApiInternalServerErrorResponse({
    description: '서버 내부 오류로 인해 영화 목록을 가져올 수 없습니다.',
  })
  getMovieDetail(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MovieDetailDto> {
    return this.movieDetailService.getMovieDetailById(id);
  }
}
