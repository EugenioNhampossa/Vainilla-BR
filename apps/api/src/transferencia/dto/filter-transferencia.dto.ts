import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginateOptions } from '../../shared/dto';
import { CreateTransferenciaDto } from './create-transferencia.dto';

export class FilterTransferencia extends IntersectionType(
  PartialType(CreateTransferenciaDto),
  PaginateOptions,
) {
  //@IsDateString()
  @IsOptional()
  firstDate: string;

  //@IsDateString()
  @IsOptional()
  secondDate?: string;

  @IsString()
  @IsOptional()
  @IsIn(['gte', 'equals', 'between', 'lte'])
  condition: string;
}
