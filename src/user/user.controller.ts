import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { CreateUserDTO } from './dto/createUser.dto';
import { UserResponseInterface } from './types/userResponse.interface';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @UsePipes(new ValidationPipe())
  async createUser(@Body('user') createUserDTO: CreateUserDTO): Promise<any> {
    return this.userService.createUser(createUserDTO);
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async login(@Body('user') loginDTO: any): Promise<UserResponseInterface> {
    const user = await this.userService.login(loginDTO);

    return this.userService.buildUserResponse(user);
  }
}
