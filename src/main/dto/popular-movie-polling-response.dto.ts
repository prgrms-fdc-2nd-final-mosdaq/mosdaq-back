// 📄 src/movies/dto/popular-movies-polled-response.dto.ts
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsArray, IsOptional } from 'class-validator';

// TO KNOW: Expose, Exclude 특징과 차이점 언제 쓰는가
export class PopularMoviePollingDto {
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
}

export class PopularMoviesPollingResponseDto {
  @ApiProperty({
    type: [PopularMoviePollingDto],
    description: '인기순, 투표 중인 영화 목록',
  })
  @Expose()
  @IsArray()
  movieList: PopularMoviePollingDto[];

  @ApiProperty({ description: '목록에 있는 영화 수' })
  @Expose()
  @IsNumber()
  movieListCount: number;
}
