import { Decimal } from '@prisma/client/runtime/library';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class itens {
  @IsString()
  @IsNotEmpty()
  id_item: string;

  @IsNumber({ allowNaN: false })
  @IsNotEmpty()
  @Min(0.01)
  quantidade: number;
}

export class CreateProdutoDto {
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  id_categoria: string;

  @IsString()
  @IsOptional()
  imagem?: string;

  @IsNumber()
  @IsNotEmpty()
  preco: Decimal;

  @IsNumber({ allowNaN: false })
  @IsNotEmpty()
  @IsPositive()
  @Min(1)
  precoCusto: Decimal;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Min(1)
  qtyPorReceita: Decimal;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsArray()
  @IsNotEmpty()
  itens: itens[];
}
