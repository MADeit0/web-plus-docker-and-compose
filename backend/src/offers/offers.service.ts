import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  @Transactional()
  async save(userId: number, createOfferDto: CreateOfferDto) {
    const wish = await this.wishesService.findOne(createOfferDto.itemId);

    if (wish.owner.id === userId) {
      throw new ForbiddenException('Вы не можете скидываться на свои подарки');
    }
    if (wish.price > wish.price)
      throw new BadRequestException('Деньги на подарок уже собраны');

    const totalAmount = parseFloat(
      (Number(wish.raised) + Number(createOfferDto.amount)).toFixed(2),
    );

    if (totalAmount > wish.price)
      throw new BadRequestException(
        'Конечная сумма не может быть больше цены подарка',
      );

    await this.wishesService.updateWishRaised(wish.id, totalAmount);

    const offer =
      (await this.offersRepository.findOne({
        where: { user: { id: userId }, item: { id: wish.id } },
        select: { id: true, amount: true },
      })) || undefined;

    return await this.offersRepository.save({
      ...createOfferDto,
      amount: parseFloat(
        (Number(offer?.amount || 0) + Number(createOfferDto.amount)).toFixed(2),
      ),
      user: { id: userId },
      item: { id: wish.id },
      id: offer?.id,
    });
  }

  async findAll() {
    return await this.offersRepository.find({
      relations: { item: true, user: true },
    });
  }

  async findOne(id: number) {
    const offer = await this.offersRepository.findOne({
      where: { id },
      relations: { item: true, user: true },
    });

    if (!offer) throw new NotFoundException('Такого предложения нет');
    return offer;
  }
}
