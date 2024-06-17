import { IsNotEmpty, IsString } from 'class-validator';

export class SendSMSDto {
  @IsString()
  @IsNotEmpty()
  variables_values: string;

  @IsString()
  @IsNotEmpty()
  route: string;

  @IsString()
  @IsNotEmpty()
  numbers: string;
}
