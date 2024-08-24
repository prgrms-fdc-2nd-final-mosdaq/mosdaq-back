// 📄 src/movies/dto/popular-movies-polled-response.dto.ts
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsArray,
  IsISO8601,
  IsOptional,
} from 'class-validator';

// TO KNOW: Expose, Exclude 특징과 차이점 언제 쓰는가
export class PopularMoviePolledMovieDto {
  @ApiProperty({ description: '영화의 고유 식별자' })
  @Expose()
  @IsNumber()
  movieId: number;

  @ApiProperty({ description: '영화 포스터의 URL 리스트' })
  @Expose()
  @IsArray()
  posterUrl: string[];

  @ApiProperty({ description: '영화 제목' })
  @Expose()
  @IsString()
  movieTitle: string;

  @ApiProperty({ description: '주가 상승에 투표한 수' })
  @Expose()
  @IsNumber()
  up: number;

  @ApiProperty({ description: '주가 하락에 투표한 수' })
  @Expose()
  @IsNumber()
  down: number;

  @ApiProperty({ description: '내가 투표한 결과', example: 'up' })
  @IsOptional()
  @IsString()
  myPollResult: string;

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
  beforePriceDate: string;

  @ApiProperty({
    description: '개봉 4주 후 날짜',
    example: '2023-02-01',
  })
  @Expose()
  @IsISO8601()
  afterPriceDate: string;
}

export class PopularMoviesPolledResponseDto {
  @ApiProperty({
    type: [PopularMoviePolledMovieDto],
    description: '개봉 4~24주, 투표된 인기순 영화 목록',
  })
  @Expose()
  @IsArray()
  movieList: PopularMoviePolledMovieDto[];

  @ApiProperty({ description: '목록에 있는 영화 수' })
  @Expose()
  @IsNumber()
  movieListCount: number;
}
