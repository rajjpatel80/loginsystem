import { UserLoginDto, PayloadDto } from './dto/user-login.dto';
import { UserLoginService } from './user_login.service';
import { ApiTags } from '@nestjs/swagger';
import { Controller, Post, Body, Get } from '@nestjs/common';

@ApiTags('login')
@Controller()
export class UserLoginController {
  constructor(private readonly userLoginService: UserLoginService) {}

  @Post('login')
  async login(@Body() loginData: UserLoginDto) {
    return this.userLoginService.userLogin(loginData);
  }

  @Post('firemessagesending')
  async firemessagesending(@Body() payLoaddto: PayloadDto) {
    return this.userLoginService.firemessagesendservice(payLoaddto);
  }
}
