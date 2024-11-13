import { Tipo_Item, Tipo_Saida } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateSaidaStockDto {
  @IsString()
  @IsNotEmpty()
  id_instalacao: string;

  @IsEnum(Tipo_Item)
  @IsNotEmpty()
  tipo_item: Tipo_Item;

  @IsString()
  @IsNotEmpty()
  id_item: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  quantidade: number;

  @IsEnum(Tipo_Saida)
  @IsNotEmpty()
  tipo_saida: Tipo_Saida;
}
