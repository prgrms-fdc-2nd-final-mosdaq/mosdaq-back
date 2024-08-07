import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class TokenRefreshResponse {
  @ApiProperty({
    description: 'refresh 토큰',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @ApiProperty({
    description: 'accessToken 토큰',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
