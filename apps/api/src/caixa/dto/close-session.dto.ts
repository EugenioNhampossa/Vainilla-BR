import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CloseSessionDto {
  @IsNotEmpty()
  @IsString()
  id_sessao: string;

  @IsNotEmpty()
  @IsInt()
  Nota1000: number;

  @IsNotEmpty()
  @IsInt()
  Nota500: number;

  @IsNotEmpty()
  @IsInt()
  Nota200: number;

  @IsNotEmpty()
  @IsInt()
  Nota100: number;

  @IsNotEmpty()
  @IsInt()
  Nota50: number;

  @IsNotEmpty()
  @IsInt()
  Nota20: number;

  @IsNotEmpty()
  @IsInt()
  Moeda10: number;

  @IsNotEmpty()
  @IsInt()
  Moeda5: number;

  @IsNotEmpty()
  @IsInt()
  Moeda2: number;

  @IsNotEmpty()
  @IsInt()
  Moeda1: number;

  @IsNotEmpty()
  @IsInt()
  Moeda05: number;

  @IsNotEmpty()
  @IsNumber()
  Pos: number;
}
