import { Decimal } from '@prisma/client/runtime/library';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export type ItensCompra = {
  id_artigo: string;
  quantidade: number;
  precoUnit: number;
};

export class CreateCompraDto {
  @IsString()
  @IsNotEmpty()
  id_fornecedor: string;

  @IsString()
  @IsNotEmpty()
  id_instalacao: string;

  @IsArray()
  @IsNotEmpty()
  @ArrayNotEmpty()
  itens: ItensCompra[];
}
