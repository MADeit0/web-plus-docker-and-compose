import { ApiProperty, PickType } from '@nestjs/swagger';
import { Wishlist } from '../entities/wishlist.entity';
import { IsArray, IsNumber } from 'class-validator';

export class CreateWishlistDto extends PickType(Wishlist, [
  'name',
  'image',
  'description',
]) {
  @ApiProperty({ required: false })
  description: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @ApiProperty({ example: [1, 2] })
  itemsId: number[];
}
