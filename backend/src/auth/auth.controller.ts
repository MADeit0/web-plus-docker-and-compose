import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { SignupUserResponseDto } from 'src/auth/dto/signup-user-response.dto';
import { SigninUserResponseDto } from 'src/auth/dto/signin-user-response.dto';
import { SigninUserDto } from 'src/users/dto/signin-user.dto';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto): Promise<SignupUserResponseDto> {
    return this.authService.signUp(createUserDto);
  }

  @ApiBody({ type: SigninUserDto })
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signin(@Request() req: { user: User }): SigninUserResponseDto {
    return this.authService.auth(req.user);
  }
}
