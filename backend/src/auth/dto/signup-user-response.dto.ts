import { ApiProperty, OmitType } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
export class SignupUserResponseDto extends OmitType(User, [
  'wishes',
  'offers',
  'wishlists',
  'password',
]) {
  @ApiProperty({ required: true })
  about: string;
  @ApiProperty({ required: true })
  avatar: string;
}
