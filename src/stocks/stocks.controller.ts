import { Controller, Get, Param } from '@nestjs/common';
import { StocksService } from './stocks.service';

@Controller('/api/v1/stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get(':movieId')
  async getStockPriceByMovieId(@Param('movieId') movieId: string) {
    // 없는 movieId -> 404
    // 아니면 주가 정보 반환
    console.log(movieId);

    const company = await this.stocksService.findCompanyByMovieId(+movieId);
    return company;
  }
}
