import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { PaginateOptions } from '../../shared/dto';
import { CreateArtigoDto } from './create-artigo.dto';

export class FilterArtigoDto extends IntersectionType(
  PartialType(CreateArtigoDto),
  PaginateOptions,
) {
  @IsOptional()
  @IsString()
  id_familia: string;
}
