import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class TokenResponse {
  @ApiProperty({
    description: 'refresh 토큰',
    type: String,
  })
  @IsString()
  refreshToken: string;

  @ApiProperty({
    description: 'accessToken 토큰',
    type: String,
  })
  @IsString()
  accessToken: string;
}
