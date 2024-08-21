import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';

export class DoPollDto {
  @IsNotEmpty()
  @IsInt()
  movieId: number;

  // @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsEnum(['up', 'down'])
  pollResult: 'up' | 'down';
}

/**
 * 투표하기
 * 처음 투표나, 투표 수정 모두에 쓰임
 */
export class DoPollResponseDto {
  @ApiProperty({
    description: '포인트',
    type: Number,
  })
  @IsInt()
  point: number;

  @ApiProperty({
    description: '랭킹',
    type: Number,
  })
  @IsInt()
  rank: number;
}
