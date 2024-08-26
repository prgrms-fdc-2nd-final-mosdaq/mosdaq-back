import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { StockInfoResponseByMovieId } from './dto/stock-info-by-movieId.dto';
import { StocksService } from './stocks.service';

@ApiTags('영화 관련 회사 주가 정보 조회 api')
@Controller('/api/v1/stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get('/movies/:movieId')
  @ApiOperation({
    summary: '영화 관련주 주가 정보 조회',
    description:
      '영화 개봉일 전후 4주간의 주가정보 및 같은 날짜의 업계 평균 주가 변화율을 얻습니다.',
  })
  @ApiOkResponse({
    description: '조회 성공',
    type: StockInfoResponseByMovieId,
  })
  @ApiNotFoundResponse({
    description: 'movieId와 일치하는 영화가 없습니다.',
  })
  @ApiBadRequestResponse({
    description: '알 수 없는 이유로 데이터를 가져오는데 실패했습니다.',
  })
  async getStockPriceByMovieId(
    @Param('movieId') movieId: string,
  ): Promise<StockInfoResponseByMovieId | null> {
    return this.stocksService.getStockInfoByMovieId(+movieId);
  }
}
