import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { PaginateOptions } from '../../shared/dto';
import { IsDateString, IsOptional } from 'class-validator';
import { CreateSaidaStockDto } from './create-saida-stock.dto';

export class FilterSaidaStockDto extends IntersectionType(
  PartialType(CreateSaidaStockDto),
  PaginateOptions,
) {
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
