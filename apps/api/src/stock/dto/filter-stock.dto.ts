import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginateOptions } from '../../shared/dto';
import { CreateStockDto } from './create-stock.dto';

export class FIlterStockDto extends IntersectionType(
  PartialType(CreateStockDto),
  PaginateOptions,
) {
  @IsString()
  @IsOptional()
  aFirst: string;

  @IsString()
  @IsOptional()
  aSecond: string;

  @IsString()
  @IsOptional()
  @IsIn(['gte', 'lte', 'equals', 'between'])
  aCondition: string;
}
