import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SigninUserResponseDto {
  @ApiProperty({ description: 'JWT-токен' })
  @IsString()
  access_token: string;
}
