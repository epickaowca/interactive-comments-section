import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { UsersService } from './users.service';

import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post() //users
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // @UseGuards(AuthGuard)
  // @Get() //users
  // findAll() {
  //   return this.usersService.findAll();
  // }

  @UseGuards(AuthGuard)
  @Get(':id') //users/2
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  // @UseGuards(AuthGuard)
  // @Patch(':id') //users/2
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @UseGuards(AuthGuard)
  // @Delete(':id') //users2
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
