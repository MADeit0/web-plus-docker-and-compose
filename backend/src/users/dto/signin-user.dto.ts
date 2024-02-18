import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class SigninUserDto extends PickType(User, [
  'username',
  'password',
] as const) {}
