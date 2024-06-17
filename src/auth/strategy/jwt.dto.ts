import { IsNumber , IsString} from 'class-validator';

export class Jwt {
  @IsString()
  id: string;

  @IsNumber()
  iat: number;

  @IsNumber()
  exp: number;
}
