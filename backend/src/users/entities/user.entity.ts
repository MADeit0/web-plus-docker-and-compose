import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MinLength,
} from 'class-validator';
import { BaseEntity } from 'src/entities/base.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true, length: 30 })
  @IsString()
  @Length(2, 30)
  @ApiProperty({
    example: 'name',
  })
  username: string;

  @Column({
    length: 200,
    default: 'Пока ничего не рассказал о себе',
  })
  @IsString()
  @IsOptional()
  @Length(2, 200)
  @ApiProperty({
    example: 'Пока ничего не рассказал о себе',
    required: false,
  })
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsOptional()
  @IsUrl()
  @ApiProperty({
    example: 'https://i.pravatar.cc/300',
    required: false,
  })
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  @ApiProperty({
    example: 'user@example.com',
  })
  email: string;

  @Column()
  @IsString()
  @MinLength(6)
  @Exclude({ toPlainOnly: true })
  @ApiProperty({
    example: 'password',
  })
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];
}
