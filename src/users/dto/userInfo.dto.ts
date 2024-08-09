import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class UserInfo {
  @ApiProperty({
    description: '이름',
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '이메일',
    type: String,
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: '포인트',
    type: Number,
  })
  @IsNumber()
  point: number;

  @ApiProperty({
    description: '상위 n%',
    type: Number,
  })
  @IsNumber()
  rank: number;
}
