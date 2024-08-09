import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

/**
 * 투표하기
 * 처음 투표나, 투표 수정 모두에 쓰임
 */
export class DoPollDto {
  @ApiProperty({
    description: '포인트',
    type: Number,
  })
  @IsNumber()
  point: number;

  @ApiProperty({
    description: '랭킹',
    type: Number,
  })
  @IsNumber()
  rank: number;
}
