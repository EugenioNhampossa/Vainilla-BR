import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { CreatePedidoDto } from './create-pedido.dto';
import { PaginateOptions } from '../../shared/dto';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class FilterPedidoDto extends IntersectionType(
  PartialType(CreatePedidoDto),
  PaginateOptions,
) {
  @IsString()
  @IsOptional()
  id_produto?: string;

  @IsString()
  @IsOptional()
  codigo_produto?: string;

  @IsDateString()
  @IsOptional()
  data?: Date;

  @IsDateString()
  @IsOptional()
  dataInicio?: Date;

  @IsDateString()
  @IsOptional()
  dataFim?: Date;
}
