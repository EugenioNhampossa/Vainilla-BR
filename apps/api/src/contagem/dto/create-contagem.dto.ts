import { Decimal } from '@prisma/client/runtime/library';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

export class CreateContagemDto {
  @IsDateString()
  @IsNotEmpty()
  data?: Date;

  @IsArray()
  @ArrayNotEmpty()
  itens: {
    id_artigo: string;
    qty_preparada: Decimal;
    qty_porPreparar: Decimal;
  }[];
}
