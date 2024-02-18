import { ApiProperty, OmitType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
export class UserPublicProfileResponseDto extends OmitType(User, [
  'wishes',
  'offers',
  'wishlists',
  'password',
  'email',
]) {
  @ApiProperty({ required: true })
  about: string;
  @ApiProperty({ required: true })
  avatar: string;
}
