import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { PaginateOptions } from '../../shared/dto';
import { IsDateString, IsOptional, IsString } from 'class-validator';
import { CreateEntradaStockDto } from './create-entrada-stock.dto';

export class FilterEntradaStockDto extends IntersectionType(
  PartialType(CreateEntradaStockDto),
  PaginateOptions,
) {
  @IsString()
  @IsOptional()
  id_instalacao?: string;

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
