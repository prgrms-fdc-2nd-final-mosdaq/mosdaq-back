import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshAuthTokenDto {
  @ApiProperty({
    description: 'refresh 토큰',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
