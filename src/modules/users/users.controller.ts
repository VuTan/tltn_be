import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '@/decorator/customize';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Public()
  @Get('random')
  findRandomUser() {
    return this.usersService.findRandomUser();
  }

  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Patch()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: string): Promise<any> {
    return this.usersService.remove(id);
  }
}
