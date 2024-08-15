import { Controller, Get, Param } from '@nestjs/common';
import { StocksService } from './stocks.service';

@Controller('/api/v1/stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get(':movieId')
  async getStockPriceByMovieId(@Param('movieId') movieId: string) {
    const movie = await this.stocksService.findMovieByMovieId(+movieId);
    const company = await this.stocksService.findCompanyByCompanyCd(
      movie.companyId,
    );

    const fourWeeksBeforeStock = await this.stocksService.getStockInfo(
      movie.movieOpenDate,
      company.tickerName,
      true,
    );

    const fourWeeksAfterStock = await this.stocksService.getStockInfo(
      movie.movieOpenDate,
      company.tickerName,
      false,
    );

    const averageStockVariation =
      await this.stocksService.getAverageStockVariation(
        fourWeeksBeforeStock.stockDate,
        fourWeeksAfterStock.stockDate,
        company.country,
      );

    return {
      beforePriceDate: fourWeeksBeforeStock.stockDate,
      beforePrice: parseFloat(fourWeeksBeforeStock.closePrice),
      afterPriceDate: fourWeeksAfterStock.stockDate,
      afterPrice: parseFloat(fourWeeksAfterStock.closePrice),
      stockIndustryAverageVariation: parseFloat(averageStockVariation),
    };
  }
}
