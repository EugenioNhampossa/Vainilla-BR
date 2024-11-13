import { Decimal } from '@prisma/client/runtime/library';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateStockDto {
  @IsNotEmpty()
  @IsString()
  id_instalacao: string;

  @IsNotEmpty()
  @IsString()
  id_artigo: string;

  @IsNotEmpty()
  @IsNumber()
  minimo: Decimal;

  @IsNotEmpty()
  @IsNumber()
  maximo: Decimal;

  @IsNotEmpty()
  @IsNumber()
  reposicao: Decimal;

  @IsNotEmpty()
  @IsNumber()
  economico: Decimal;
}
