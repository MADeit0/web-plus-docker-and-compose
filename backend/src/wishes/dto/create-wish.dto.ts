import { Wish } from '../entities/wish.entity';
import { PickType } from '@nestjs/swagger';

export class CreateWishDto extends PickType(Wish, [
  'name',
  'link',
  'image',
  'price',
  'description',
] as const) {}
