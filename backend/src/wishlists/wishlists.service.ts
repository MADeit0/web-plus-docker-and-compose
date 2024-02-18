import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async create(userId: number, createWishlistDto: CreateWishlistDto) {
    const wishes = await this.wishesService.findManyByIds(
      createWishlistDto.itemsId,
    );

    const newWishlist = this.wishlistsRepository.create({
      ...createWishlistDto,
      owner: { id: userId },
      items: wishes,
    });

    return await this.wishlistsRepository.save(newWishlist);
  }

  async findAll() {
    return await this.wishlistsRepository.find({
      relations: { owner: true, items: true },
    });
  }

  async findOne(id: number) {
    const wish = await this.wishlistsRepository.findOne({
      where: { id },
      relations: { owner: true, items: true },
    });
    if (!wish) throw new NotFoundException('Коллекция не найдена');
    return wish;
  }

  async updateWishlist(
    id: number,
    { itemsId, ...updateWishlistDto }: UpdateWishlistDto,
    userId: number,
  ) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: { owner: true },
      select: { id: true, owner: { id: true } },
    });

    if (!wishlist) throw new NotFoundException('Коллекция не найдена');

    if (wishlist.owner.id !== userId)
      throw new ForbiddenException('Нельзя редактировать чужие коллекции');

    const wishes = await this.wishesService.findManyByIds(itemsId);

    return await this.wishlistsRepository.save({
      id,
      ...updateWishlistDto,
      items: wishes,
    });
  }

  async remove(id: number, userId: number) {
    const wishlist = await this.findOne(id);
    if (wishlist.owner.id !== userId)
      throw new ForbiddenException('Нельзя удалять чужие подарки');

    return await this.wishlistsRepository.remove(wishlist);
  }
}
