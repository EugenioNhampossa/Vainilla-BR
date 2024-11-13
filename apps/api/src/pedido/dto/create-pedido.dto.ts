import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { itemPedido } from '../../shared/@types';
import { Tipo_Pagamento } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class CreatePedidoDto {
  @IsOptional()
  @IsString()
  id_cliente?: string;

  @IsNotEmpty()
  @IsString()
  id_caixa: string;
  @IsNotEmpty()
  @IsString()
  id_sessao: string;

  @IsNotEmpty()
  @IsString()
  id_instalacao: string;

  @IsNotEmpty()
  @IsString()
  codigo: string;

  @IsOptional()
  @IsNumber()
  desconto?: Decimal;

  @IsNotEmpty()
  @IsString()
  tipoPagamento: Tipo_Pagamento;

  @IsOptional()
  @IsBoolean()
  bloqueado?: boolean;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  itens: itemPedido[];
}
