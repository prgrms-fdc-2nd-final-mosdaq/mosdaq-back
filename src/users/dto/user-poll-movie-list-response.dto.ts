import {
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum PollResult {
  UP = 'up',
  DOWN = 'down',
  NONE = null,
}

export class UserPollMovieDto {
  @ApiProperty({
    description: '영화의 고유 식별자',
    example: 1,
  })
  @IsNumber()
  movieId: number;

  @ApiProperty({
    description: '영화 제목',
    example: 'Inception',
  })
  @IsString()
  movieTitle: string;

  @ApiProperty({
    description: '영화 포스터의 URL 리스트',
    type: [String],
    example: [
      'https://example.com/poster1.jpg',
      'https://example.com/poster2.jpg',
    ],
  })
  @IsArray()
  @IsString({ each: true })
  posterUrl: string[];

  @ApiProperty({
    description: '주가 상승에 투표한 수',
    example: 120,
  })
  @IsNumber()
  up: number;

  @ApiProperty({
    description: '주가 하락에 투표한 수',
    example: 45,
  })
  @IsNumber()
  down: number;

  @ApiProperty({
    description: '내 투표 결과',
    enum: PollResult,
    example: PollResult.UP || PollResult.NONE,
  })
  @IsEnum(PollResult)
  pollResult: PollResult;

  @ApiProperty({
    description: '영화가 제작된 국가 코드',
    example: 'US',
    required: false,
  })
  @IsOptional()
  @IsString()
  countryCode?: string;

  @ApiProperty({
    description: '투표 전 영화 가격',
    example: 15.99,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  beforePrice?: number;

  @ApiProperty({
    description: '투표 전 영화 가격의 날짜',
    example: '2024-08-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  beforePriceDate?: string;

  @ApiProperty({
    description: '투표 후 영화 가격',
    example: 17.99,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  afterPrice?: number;

  @ApiProperty({
    description: '투표 후 영화 가격의 날짜',
    example: '2024-08-16',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  afterPriceDate?: string;
}

export class UserPollPaginationDto {
  @ApiProperty({
    description: '현재 페이지 번호',
    example: 1,
  })
  @IsNumber()
  currentPage: number;

  @ApiProperty({
    description: '전체 페이지 수',
    example: 10,
  })
  @IsNumber()
  totalPages: number;
}

export class UserPollMovieListResponseDto {
  @ApiProperty({
    type: [UserPollMovieDto],
    description: '투표 중인 영화 목록',
  })
  @Type(() => UserPollMovieDto)
  movieList: UserPollMovieDto[];

  @ApiProperty({
    description: '목록에 있는 영화 수',
    example: 25,
  })
  @IsNumber()
  movieListCount: number;

  @ApiProperty({
    description: '페이지네이션 정보',
    type: UserPollPaginationDto,
  })
  @Type(() => UserPollPaginationDto)
  pagination: UserPollPaginationDto;
}