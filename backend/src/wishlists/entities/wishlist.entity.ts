import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { BaseEntity } from 'src/entities/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@Entity()
export class Wishlist extends BaseEntity {
  @Column({ length: 250 })
  @IsString()
  @Length(1, 250)
  @ApiProperty({ example: 'Коллекция 3D принтеров' })
  name: string;

  @Column({ length: 1500, default: '' })
  @IsString()
  @Length(1, 1500)
  @IsOptional()
  @ApiProperty({ example: 'Тут будет описание' })
  description: string;

  @Column()
  @IsUrl()
  @ApiProperty({
    example: 'https://trashbox.ru/files/528970_ff9e29/3dprint.jpg',
  })
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];
}
