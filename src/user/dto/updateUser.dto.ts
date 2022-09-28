import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDTO {
  readonly username: string;

  @IsEmail()
  readonly email: string;

  readonly bio: string;

  readonly image: string;
}
