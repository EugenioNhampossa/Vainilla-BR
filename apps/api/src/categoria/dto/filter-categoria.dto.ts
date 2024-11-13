import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaDto } from './create-categoria.dto';
import { PaginateOptions } from '../../shared/dto';

export class FilterCategoriaDto extends IntersectionType(
  PartialType(CreateCategoriaDto),
  PaginateOptions,
) {}
