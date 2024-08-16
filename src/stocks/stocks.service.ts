import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from 'src/poll/entities/movie.entity';
import { shiftDateByWeeks, getYesterdayDate } from 'src/util/date';
import { Repository, In } from 'typeorm';
import { Company } from './entities/company.entity';
import { Stock } from './entities/stock.entity';
import { StockDto } from './dto/stock.dto';
import { CompanyDto } from './dto/company.dto';

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

  async findMovieByMovieId(movieId: number): Promise<Movie | null> {
    try {
      const movie = await this.movieRepository.findOne({
        where: { movieId: movieId },
      });
      if (!movie) throw new NotFoundException('존재하지 않는 영화 id입니다.');
      return movie;
    } catch (error) {
      console.log('Error while search movie by movieId');
      throw new BadRequestException();
    }
  }

  async findCompanyByCompanyCd(companyCd: string): Promise<CompanyDto | null> {
    try {
      const company = await this.companyRepository.findOne({
        where: { companyCd: companyCd },
      });

      return company;
    } catch (error) {
      console.log('Error while search movie by movieId');
      throw new BadRequestException();
    }
  }

  async getStockInfo(
    openDate: Date,
    tickerName: string,
    isPast: boolean,
  ): Promise<StockDto | null> {
    try {
      let shiftedDate = isPast
        ? shiftDateByWeeks(openDate, true)
        : shiftDateByWeeks(openDate, false);
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
      throw new BadRequestException();
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
      let priceBoundary = await Promise.all(
        companies.map(async (company) => {
          const prices = await this.stockRepository.find({
            where: {
              tickerName: company.tickerName,
              stockDate: In([fromDate, toDate]),
            },
          });

          let fromPrice = +prices[0].closePrice;
          let toPrice = +prices[1].closePrice;

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
      throw new BadRequestException();
    }
  }
}
