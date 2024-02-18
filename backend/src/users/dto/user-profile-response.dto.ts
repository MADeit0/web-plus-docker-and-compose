import { ApiProperty, OmitType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
export class UserProfileResponseDto extends OmitType(User, [
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
