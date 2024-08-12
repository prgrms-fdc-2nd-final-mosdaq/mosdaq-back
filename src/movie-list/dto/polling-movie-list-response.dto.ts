// 📄 src/movies/dto/popular-movies-polled-response.dto.ts
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsArray,
  IsISO8601,
  IsOptional,
  IsIn,
} from 'class-validator';

// TO KNOW: Expose, Exclude 특징과 차이점 언제 쓰는가
/**
{
	 movieList : [
		 {
			 movieId : number
			 movieTitle : string
			 posterUrl : string[]
			 up : number // 화면에는 퍼센트로 표시
			 down : number // 화면에는 퍼센트로 표시
			 myPollResult?: string // "up" || "down"
		 }
		 ...
	 ]
	 movieListCount: number
	 pagination : number
}
 */
export class PollingMovieDto {
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

export class PollingMovieListDto {
  @ApiProperty({
    type: [PollingMovieDto],
    description: '투표 중인 영화 목록',
  })
  @Expose()
  @IsArray()
  movieList: PollingMovieDto[];

  @ApiProperty({ description: '목록에 있는 영화 수' })
  @Expose()
  @IsNumber()
  movieListCount: number;

  @ApiProperty({ description: '현재 페이지 번호' })
  @Expose()
  @IsNumber()
  pagination: number;
}
