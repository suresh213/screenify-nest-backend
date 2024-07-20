import { IsString } from 'class-validator';
import { User } from '../../database/schema/user.schema';

export class AuthResponseDto {
  user: User;

  @IsString()
  accessToken: string;
}
