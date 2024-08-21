// 📄 src/movies/dto/popular-movies-polled-response.dto.ts
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsArray } from 'class-validator';

export class StockPriceDto {
  @ApiProperty({ description: '주식 가격' })
  @Expose()
  @IsNumber()
  price: number;

  @ApiProperty({ description: '주식 날짜' })
  @Expose()
  @IsString()
  date: string;
}

export class MainMovieDto {
  @ApiProperty({ description: '영화의 고유 식별자' })
  @Expose()
  @IsNumber()
  movieId: number;

  @ApiProperty({ description: '영화 제목' })
  @Expose()
  @IsString()
  movieTitle: string;

  @ApiProperty({ description: '영화 포스터의 URL 리스트' })
  @Expose()
  @IsArray()
  posterUrl: string[];

  @ApiProperty({ description: '영화사의 국가 코드' })
  @Expose()
  @IsString()
  countryCode: string;

  @ApiProperty({ description: '영화사 이름' })
  @Expose()
  @IsString()
  companyName: string;

  @ApiProperty({
    description: '개봉일 기준 4주 전 후, 총 8주 간의 주식 가격',
    type: StockPriceDto,
  })
  @Expose()
  @IsArray()
  stockPriceList: StockPriceDto[];
}

export class MainMovieResponseDto {
  @ApiProperty({
    type: [MainMovieDto],
    description: '개봉 4~24주, 투표된 인기순 영화 목록',
  })
  @Expose()
  @IsArray()
  movieList: MainMovieDto[];

  @ApiProperty({ description: '목록에 있는 영화 수' })
  @Expose()
  @IsNumber()
  movieListCount: number;
}
