import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsArray, IsOptional, IsIn } from 'class-validator';

export class PollMovieDto {
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

  @ApiProperty({ description: '주가 상승에 투표한 수' })
  @Expose()
  @IsNumber()
  up: number;

  @ApiProperty({ description: '주가 하락에 투표한 수' })
  @Expose()
  @IsNumber()
  down: number;

  @ApiProperty({ description: '내 투표 결과', required: false })
  @Expose()
  @IsOptional()
  @IsIn(['up', 'down', null])
  @IsString()
  myPollResult?: 'up' | 'down' | null;
}

class moviePaginationDto {
  @ApiProperty({ description: '현재 페이지 번호' })
  @Expose()
  @IsNumber()
  currentPage: number;

  @ApiProperty({ description: '전체 페이지 수' })
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

  @ApiProperty({ description: '목록에 있는 영화 수' })
  @Expose()
  @IsNumber()
  movieListCount: number;

  @ApiProperty({ description: '현재 페이지 번호' })
  @Expose()
  @IsNumber()
  pagination: moviePaginationDto;
}
