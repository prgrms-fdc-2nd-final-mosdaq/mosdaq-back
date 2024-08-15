import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsArray, IsOptional, IsIn } from 'class-validator';

export class PollMovieDto {
  @ApiProperty({
    description: '영화의 고유 식별자',
    example: 1,
  })
  @Expose()
  @IsNumber()
  movieId: number;

  @ApiProperty({
    description: '영화 제목',
    example: 'Inception',
  })
  @Expose()
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
  @Expose()
  @IsArray()
  posterUrl: string[];

  @ApiProperty({
    description: '주가 상승에 투표한 수',
    example: 120,
  })
  @Expose()
  @IsNumber()
  up: number;

  @ApiProperty({
    description: '주가 하락에 투표한 수',
    example: 45,
  })
  @Expose()
  @IsNumber()
  down: number;

  @ApiProperty({
    description: '내 투표 결과',
    enum: ['up', 'down', null],
    required: false,
    example: 'up',
  })
  @Expose()
  @IsOptional()
  @IsIn(['up', 'down', null])
  @IsString()
  myPollResult?: 'up' | 'down' | null;
}

export class MoviePaginationDto {
  @ApiProperty({
    description: '현재 페이지 번호',
    example: 1,
  })
  @Expose()
  @IsNumber()
  currentPage: number;

  @ApiProperty({
    description: '전체 페이지 수',
    example: 10,
  })
  @Expose()
  @IsNumber()
  totalPages: number;
}

export class PollMovieListResponseDto {
  @ApiProperty({
    type: [PollMovieDto],
    description: '투표 중인 영화 목록',
  })
  @Expose()
  @IsArray()
  movieList: PollMovieDto[];

  @ApiProperty({
    description: '목록에 있는 영화 수',
    example: 25,
  })
  @Expose()
  @IsNumber()
  movieListCount: number;

  @ApiProperty({
    description: '페이지네이션 정보',
    type: MoviePaginationDto,
  })
  @Expose()
  @IsNumber()
  pagination: MoviePaginationDto;
}
