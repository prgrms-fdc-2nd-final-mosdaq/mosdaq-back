import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class GetMovieQuizDto {
  @ApiProperty({ description: '문제 개수' })
  @IsNumber()
  count: number;
}
