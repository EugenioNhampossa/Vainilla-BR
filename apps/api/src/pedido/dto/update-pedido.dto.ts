import { PartialType } from '@nestjs/mapped-types';
import { CreatePedidoDto } from './create-pedido.dto';
import { Estado_Pedido } from '@prisma/client';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { itemPedido } from 'src/shared/@types';

export class UpdatePedidoDto extends PartialType(CreatePedidoDto) {
  @IsEnum(Estado_Pedido)
  @IsOptional()
  estado?: Estado_Pedido;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  itens: itemPedido[];
}
