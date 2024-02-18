import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Length,
  Max,
} from 'class-validator';
import { BaseEntity } from 'src/entities/base.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Wish extends BaseEntity {
  @Column({ length: 250 })
  @IsString()
  @Length(1, 250)
  @ApiProperty({
    example: 'ANYCUBIC Photon Mono M5s Pro',
  })
  name: string;

  @Column()
  @IsUrl()
  @ApiProperty({
    example: 'https://example.com/71236',
  })
  link: string;

  @Column()
  @IsUrl()
  @ApiProperty({
    example:
      'https://ae04.alicdn.com/kf/S753154bac73c4afa99e4c03d1782f008A.jpg_640x640.jpg',
  })
  image: string;

  @Column('decimal', { precision: 10, scale: 2 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @Max(1000000.0)
  @ApiProperty({
    example: 49000,
  })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Max(1000000.0)
  @ApiProperty({
    example: 0,
  })
  raised: number;

  @Column({ length: 1024 })
  @IsString()
  @Length(1, 1024)
  @ApiProperty({
    example: 'SLA 3d принтер',
  })
  description: string;

  @Column('int', { default: 0 })
  @IsInt()
  copied: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
}
