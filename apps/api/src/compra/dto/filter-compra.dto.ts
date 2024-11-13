import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';
import { PaginateOptions } from '../../shared/dto';
import { CreateCompraDto } from './create-compra.dto';

export class FilterCompraDto extends IntersectionType(
  PartialType(CreateCompraDto),
  PaginateOptions,
) {
  @IsDateString()
  @IsOptional()
  data?: Date;
}
