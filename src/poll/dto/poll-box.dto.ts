import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class PollBoxDto {
  @ApiProperty({
    description: 'movie-id',
    type: Number,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'user-id',
    type: Number,
  })
  @IsOptional()
  userId?: number;
}

export class PollBoxResponseDto {
  @ApiProperty({
    description: '총 투표수',
    type: Number,
  })
  @IsInt()
  total: number;

  @ApiProperty({
    description: 'up 투표수',
    type: Number,
  })
  @IsInt()
  up: number;

  @ApiProperty({
    description: 'down 투표수',
    type: Number,
  })
  @IsInt()
  down: number;

  @ApiProperty({
    description: '유저 본인의 선택',
    enum: ['up', 'down', null],
    type: String,
    nullable: true,
  })
  @IsOptional()
  pollResult?: 'up' | 'down' | null;
}
