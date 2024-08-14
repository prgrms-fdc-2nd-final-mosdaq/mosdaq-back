import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class MovieQuizDto {
  @ApiProperty({ description: '영화 제목' })
  @IsString()
  movieTitle: string;

  @ApiProperty({ description: '영화 포스터 URL' })
  @IsString()
  moviePoster: string;

  @ApiProperty({ description: '4주 전 가격' })
  @IsNumber()
  fourWeeksBeforePrice: number;

  @ApiProperty({ description: '4주 후 가격' })
  @IsNumber()
  fourWeeksAfterPrice: number;

  @ApiProperty({ description: '통화' })
  @IsString()
  currency: string;
}
