import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { Wish } from './entities/wish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UpdateWishDto } from './dto/update-wish.dto';
import { plainToClass } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  async create(id: number, createWishDto: CreateWishDto) {
    return await this.wishesRepository.save({
      ...createWishDto,
      owner: { id },
    });
  }

  async findOne(id: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: { owner: true, offers: true },
    });
    if (!wish) throw new NotFoundException('Подарок не найден');
    return wish;
  }

  async findManyByIds(wishIds: number[]) {
    return await this.wishesRepository.find({
      where: { id: In(wishIds) },
      order: { createdAt: 'ASC' },
    });
  }

  async findTopWishes() {
    return await this.wishesRepository.find({
      take: 20,
      order: { copied: 'DESC' },
      relations: ['owner'],
    });
  }

  async findLastWishes() {
    return await this.wishesRepository.find({
      take: 40,
      order: { createdAt: 'DESC' },
      relations: ['owner'],
    });
  }

  async updateWish(id: number, updateWishDto: UpdateWishDto, userId: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: { owner: true },
      select: { raised: true, id: true, owner: { id: true } },
    });

    if (!wish) throw new NotFoundException('Подарок не найден');

    if (wish.owner.id !== userId)
      throw new ForbiddenException('Нельзя редактировать чужие подарки');

    if (wish.raised > 0)
      throw new BadRequestException(
        'Нельзя редактировать подарок когда уже есть желающие скинуться',
      );

    await this.wishesRepository.update(id, updateWishDto);

    return { message: 'Изменения успешно сохранены!' };
  }

  async removeOne(id: number, userId: number) {
    const wish = await this.findOne(id);
    if (wish.owner.id !== userId)
      throw new ForbiddenException('Нельзя удалять чужие подарки');

    return await this.wishesRepository.remove(wish);
  }

  @Transactional()
  async copy(id: number, userId: number) {
    const wish = await this.findOne(id);
    if (wish.owner.id === userId)
      throw new ForbiddenException('Нельзя копировать свои подарки');

    await this.wishesRepository.increment({ id }, 'copied', 1);

    const copyWish = this.wishesRepository.create({
      ...wish,
    });

    const transformedCopyWish = plainToClass(CreateWishDto, copyWish, {
      strategy: 'excludeAll',
    });
    return await this.create(userId, transformedCopyWish);
  }

  async updateWishRaised(id: number, totalAmount: number) {
    return await this.wishesRepository.update(id, { raised: totalAmount });
  }
}
