import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { CreateProdutoDto } from './create-produto.dto';
import { PaginateOptions } from '../../shared/dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class FilterProdutoDto extends IntersectionType(
  PartialType(CreateProdutoDto),
  PaginateOptions,
) {
  @IsBoolean()
  @IsOptional()
  isCombo?: boolean;
}
