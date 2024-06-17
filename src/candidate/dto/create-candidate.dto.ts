import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateCandidateDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  assessment: string;
}
