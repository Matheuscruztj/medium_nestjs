import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/config';
import { UserResponseInterface } from './types/userResponse.interface';
import { LoginUserDTO } from './dto/loginUser.dto';
import { compare } from 'bcryptjs';
import { UpdateUserDTO } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDTO: CreateUserDTO) {
    const userByEmail = await this.userRepository.findOne({
      email: createUserDTO.email,
    });

    const userByUsername = await this.userRepository.findOne({
      username: createUserDTO.username,
    });

    if (userByEmail || userByUsername)
      throw new HttpException(
        'Email or username are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    const newUser = new UserEntity();

    Object.assign(newUser, createUserDTO);

    return await this.userRepository.save(newUser);
  }

  async findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne(id);
  }

  async login(LoginUserDTO: LoginUserDTO): Promise<UserEntity> {
    const user = await this.userRepository.findOne(
      {
        email: LoginUserDTO.email,
      },
      {
        select: ['id', 'username', 'email', 'bio', 'image', 'password'],
      },
    );

    if (!user)
      throw new HttpException(
        'Credentials are not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    const isPasswordCorrect = await compare(
      LoginUserDTO.password,
      user.password,
    );

    if (!isPasswordCorrect)
      throw new HttpException(
        'Credentials are not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    delete user.password;

    return user;
  }

  async updateUser(
    userId: number,
    updateUserDTO: UpdateUserDTO,
  ): Promise<UserEntity> {
    const user = await this.findById(userId);
    Object.assign(user, updateUserDTO);
    return await this.userRepository.save(user);
  }

  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET,
    );
  }

  async buildUserResponse(user: UserEntity): Promise<UserResponseInterface> {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
}
