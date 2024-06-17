import { IsNotEmpty, IsString } from 'class-validator';

export class UserVerificationDto {
  @IsNotEmpty()
  @IsString()
  type?: string;

  @IsNotEmpty()
  @IsString()
  value?: string;
}
