import { IsOptional, IsString } from 'class-validator';

export class VerifyUserCodeDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  mobileNumber?: string;

  @IsOptional()
  @IsString()
  otp?: string;

  @IsOptional()
  @IsString()
  newPassword?: string;
}
