import { Unidade } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateArtigoDto {
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsOptional()
  id_marca?: string;

  @IsString()
  @IsOptional()
  id_subfamilia?: string;

  @IsNotEmpty()
  @IsEnum(Unidade)
  unidade: Unidade;

  @IsNumber()
  @IsNotEmpty()
  taxaIva: Decimal;

  @IsString()
  @IsOptional()
  codigoBarras?: string;

  @IsString()
  @IsOptional()
  descricao?: string;
}
