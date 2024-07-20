import { IsString, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

export class CreateAssessmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsNumber()
  @IsNotEmpty()
  experience: number;

  @IsString()
  @IsNotEmpty()
  difficulty: string;

  @IsNumber()
  @IsNotEmpty()
  totalQuestions: number;

  @IsNumber()
  timeLimit: number;

  @IsString()
  @IsNotEmpty()
  type: string;

  settings: {
    shuffleQuestions: boolean;
    randomQuestions: boolean;
    allowSwitchingWindows: boolean;
    allowSwitchingBetweenQuestions: boolean;
    allowCopyPaste: boolean;
  };
}
