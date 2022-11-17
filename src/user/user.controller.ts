import { CreatePassportDto } from './dto/create-passport.dto';
import { Post, Body, Get, Put, Controller, Param } from '@nestjs/common';
import { UserService } from './User.Service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('user')
@Controller()
export class UserController {
  constructor(private readonly userSerice: UserService) {}

  @Post('createuser')
  async create(@Body() userData: CreateUserDto) {
    //console.log(userData.fName);

    return this.userSerice.Create(userData);
  }

  @Get('getAllUsers')
  @ApiBearerAuth('access-token')
  @ApiBearerAuth('refresh-token')
  async getallusers() {
    return this.userSerice.getAllUser();
  }

  @Post('findUserById')
  @ApiBearerAuth('access-token')
  @ApiBearerAuth('refresh-token')
  async findUserById(@Body() userdata: CreateUserDto) {
    console.log('id==>>>' + userdata.idUser);
    return this.userSerice.findUserById(userdata.idUser);
  }

  @Put('updateUser')
  @ApiBearerAuth('access-token')
  @ApiBearerAuth('refresh-token')
  async updateUser(@Body() userData: UpdateUserDto) {
    return this.userSerice.updateUSer(userData);
  }

  @Get('getUserProfile')
  @ApiBearerAuth('access-token')
  @ApiBearerAuth('refresh-token')
  async getUserProfile() {
    return this.userSerice.getUserProfile();
  }

  @Post('updatepassportservices')
  @ApiBearerAuth('access-token')
  @ApiBearerAuth('refresh-token')
  async updatepassportservice(@Body() tokendata: CreatePassportDto) {
    return this.userSerice.updatePassportRefreshToken(
      tokendata.accessToken,
      tokendata.refreshToken,
    );
  }

  @Get('getalluserdata')
  @ApiBearerAuth('access-token')
  @ApiBearerAuth('refresh-token')
  async getalluserdata() {
    return this.userSerice.getAllUserData();
  }
}
