import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from 'src/poll/entities/movie.entity';
import {
  shiftDateByWeeks,
  getYesterdayDate,
  getYYYYMMDDDate,
} from 'src/util/date';
import { Repository, In, Between } from 'typeorm';
import { Company } from './entities/company.entity';
import { Stock } from './entities/stock.entity';
import { StockDto } from './dto/stock.dto';
import { StockInfoResponseByMovieId } from './dto/stock-info-by-movieId.dto';
import { matchTickerToCompanyName } from 'src/util/company';

@Injectable()
export class StocksService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,

    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async getStockInfoByMovieId(
    movieId: number,
  ): Promise<StockInfoResponseByMovieId | null> {
    try {
      const movie: Movie = await this.movieRepository.findOne({
        where: { movieId: movieId },
      });
      if (!movie) throw new NotFoundException('존재하지 않는 영화 id입니다.');

      const company: Company = await this.companyRepository.findOne({
        where: { companyCd: movie.companyId },
      });

      const fourWeeksBeforeStock: Stock = await this.getStockInfo(
        movie.movieOpenDate,
        company.tickerName,
        true,
      );

      const fourWeeksAfterStock: Stock = await this.getStockInfo(
        movie.movieOpenDate,
        company.tickerName,
        false,
      );

      const averageStockVariation = await this.getAverageStockVariation(
        fourWeeksBeforeStock.stockDate,
        fourWeeksAfterStock.stockDate,
        company.country,
      );

      const stockPrices = await this.getStockPriceByRange(
        company.tickerName,
        movie.movieOpenDate,
      );

      return {
        beforePriceDate: fourWeeksBeforeStock.stockDate,
        beforePrice: Number(fourWeeksBeforeStock.closePrice),
        afterPriceDate: fourWeeksAfterStock.stockDate,
        afterPrice: Number(fourWeeksAfterStock.closePrice),
        stockIndustryAverageVariation: Number(averageStockVariation),
        companyName: matchTickerToCompanyName(company.tickerName),
        countryCode: company.country,
        stockPriceList: stockPrices,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.log('error in getStockInfoByMovieId', error);
      throw new BadRequestException('알 수 없는 이유로 요청에 실패하였습니다.');
    }
  }

  async getStockInfo(
    movieOpenDate: Date,
    tickerName: string,
    isPast: boolean,
  ): Promise<StockDto | null> {
    try {
      let shiftedDate = isPast
        ? shiftDateByWeeks(movieOpenDate, true)
        : shiftDateByWeeks(movieOpenDate, false);
      let stock: StockDto;
      // 4주 shift된 날짜가 휴장일일 가능성 체크 + 개봉 4주가 지나지 않았을 가능성 체크
      while (1) {
        stock = await this.stockRepository.findOne({
          where: {
            tickerName: tickerName,
            stockDate: shiftedDate,
          },
        });
        if (!stock) shiftedDate = getYesterdayDate(shiftedDate);
        else break;
      }

      return stock;
    } catch (error) {
      console.log('Error in getStockInfoByMovieId', error);
      throw new BadRequestException('알 수 없는 이유로 요청에 실패하였습니다.');
    }
  }

  async getAverageStockVariation(
    fromDate: Date,
    toDate: Date,
    countryCode: string,
  ) {
    try {
      // countryCode가 일치하는 회사를 찾습니다.
      const companies = await this.companyRepository.find({
        where: { country: countryCode },
      });

      // 모든 회사에 대해 주어진 날짜의 주가를 얻음
      const priceBoundary = await Promise.all(
        companies.map(async (company) => {
          const prices = await this.stockRepository.find({
            where: {
              tickerName: company.tickerName,
              stockDate: In([fromDate, toDate]),
            },
          });

          let fromPrice = 0;
          let toPrice = 0;

          if (prices.length > 1) {
            fromPrice = +prices[0].closePrice;
            toPrice = +prices[1].closePrice;
          } else {
            fromPrice = +prices[0].closePrice;
            toPrice = +prices[0].closePrice;
          }

          return { fromPrice, toPrice };
        }),
      );

      // 주가 변동률을 계산하고 평균을 구합니다.
      let totalVariation = 0;
      priceBoundary.forEach((boundary) => {
        const { fromPrice, toPrice } = boundary;
        const variation = ((toPrice - fromPrice) / fromPrice) * 100;
        totalVariation += variation;
      });

      const averageVariation = totalVariation / priceBoundary.length;

      return averageVariation.toFixed(2);
    } catch (error) {
      console.log('Error in getAverageStockVariation', error);
      throw new BadRequestException('알 수 없는 이유로 요청에 실패하였습니다.');
    }
  }

  async getStockPriceByRange(tickerName: string, movieOpenDate: Date) {
    try {
      const fourWeeksBefore = shiftDateByWeeks(movieOpenDate, true);
      const fourWeeksLater = shiftDateByWeeks(movieOpenDate, false);

      const prices = await this.stockRepository.find({
        where: {
          tickerName: tickerName,
          stockDate: Between(fourWeeksBefore, fourWeeksLater),
        },
      });

      return prices.map((stock) => ({
        price: Number(stock.closePrice),
        date: getYYYYMMDDDate(stock.stockDate),
      }));
    } catch (error) {
      console.log('Error in getStockPriceByRange', error);
      throw new BadRequestException('알 수 없는 이유로 요청에 실패하였습니다.');
    }
  }
}
