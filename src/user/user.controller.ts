import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt.guard';

import { User } from '../decorators/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/role.guard';
import { Role } from '../constants/enums/role.enum';
import { HasRoles } from '../decorators/role.decorator';
import { User as UserSchema } from '../database/schema/user.schema';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('update')
  async update(
    @User('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(userId, updateUserDto);
  }
}
