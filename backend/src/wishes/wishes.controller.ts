import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { UpdateWishDto } from './dto/update-wish.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('wishes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  create(@Request() req: { user: User }, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(req.user.id, createWishDto);
  }

  @Get('top')
  getTopWishes() {
    return this.wishesService.findTopWishes();
  }

  @Get('last')
  getLastWishes() {
    return this.wishesService.findLastWishes();
  }

  @Get(':id')
  getWishesById(@Param('id') id: number) {
    return this.wishesService.findOne(id);
  }

  @Patch(':id')
  updateWish(
    @Request() req: { user: User },
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.updateWish(id, updateWishDto, req.user.id);
  }

  @Delete(':id')
  removeWish(@Request() req: { user: User }, @Param('id') id: number) {
    return this.wishesService.removeOne(id, req.user.id);
  }

  @Post(':id/copy')
  copyWish(@Param('id') id: number, @Request() req: { user: User }) {
    return this.wishesService.copy(id, req.user.id);
  }
}
