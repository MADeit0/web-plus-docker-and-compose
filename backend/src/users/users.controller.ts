import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  UseInterceptors,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { RemoveEmailInterceptor } from 'src/users/interseptors/remove-email.interceptor';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { Wish } from 'src/wishes/entities/wish.entity';
import { UserPublicProfileResponseDto } from './dto/user-public-profile-response.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile(@Request() req: { user: User }): UserProfileResponseDto {
    return req.user;
  }

  @Patch('me')
  updateUserProfile(
    @Request() req: { user: User },
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    return this.usersService.updateOne(req.user, updateUserDto);
  }

  @Post('find')
  findByMany(
    @Body() findUserDto: FindUserDto,
  ): Promise<UserProfileResponseDto> {
    return this.usersService.findMany(findUserDto.query);
  }

  @Get('me/wishes')
  getOwnerWishes(@Request() req: { user: User }): Promise<Wish[]> {
    return this.usersService.findWishes(req.user.id);
  }

  @UseInterceptors(RemoveEmailInterceptor)
  @Get(':username')
  findUser(
    @Param('username') username: string,
  ): Promise<UserPublicProfileResponseDto> {
    return this.usersService.findUser(username);
  }

  @Get(':username/wishes')
  getUserWishes(@Param('username') username: string): Promise<Wish[]> {
    return this.usersService.getUserWishes(username);
  }
}
