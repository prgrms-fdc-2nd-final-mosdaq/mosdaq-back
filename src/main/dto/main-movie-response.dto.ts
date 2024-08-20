// 📄 src/movies/dto/popular-movies-polled-response.dto.ts
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsArray, IsISO8601 } from 'class-validator';

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

// TO KNOW: Expose, Exclude 특징과 차이점 언제 쓰는가
export class MainMovieDto {
  // export class PopularMoviePolledMovieDto {
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

  @ApiProperty({ description: '개봉 4주 전 주식 가격' })
  @Expose()
  @IsNumber()
  beforePrice: number;

  @ApiProperty({ description: '개봉 4주 후 주식 가격' })
  @Expose()
  @IsNumber()
  afterPrice: number;

  @ApiProperty({
    description: '개봉 4주 전 날짜',
    example: '2023-01-01',
  })
  @Expose()
  @IsISO8601()
  beforeDate: string;

  @ApiProperty({
    description: '개봉 4주 후 날짜',
    example: '2023-01-29',
  })
  @Expose()
  @IsISO8601()
  afterDate: string;

  @ApiProperty({
    description: '개봉 4, 8주 전, 개봉일, 개봉 4, 8주 후 주식 가격',
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
