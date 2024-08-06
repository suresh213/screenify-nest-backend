import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateCandidateAssessmentDto {
  @IsNotEmpty()
  @IsString()
  candidate: string;

  @IsNotEmpty()
  @IsString()
  assessment: string;
}
