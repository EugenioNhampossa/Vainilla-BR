import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OpenSessionDto {
  @IsNotEmpty()
  @IsNumber()
  valor_entrada: number;

  @IsNotEmpty()
  @IsString()
  id_caixa: string;
}
