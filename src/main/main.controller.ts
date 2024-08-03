import { Controller, Get } from '@nestjs/common';
import { MainService } from './main.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('api/v1/main-movie')
@ApiTags('대표 영화 api')
export class MainController {
  constructor(private mainService: MainService) {}

  @Get('/')
  @ApiOperation({
    summary: '대표 영화 제공 API',
    description:
      '인기 영화 5개를 선정하여 영화 데이터 및 개봉 4주 전, 4주 후 주가 데이터를 전달한다',
  })
  @ApiResponse({
    description:
      '인기 영화 5개를 선정하여 영화 데이터 및 개봉 4주 전, 4주 후 주가 데이터를 전달한다',
  })
  async mainMovie() {
    return this.mainService.getMainMovies();
  }
}
