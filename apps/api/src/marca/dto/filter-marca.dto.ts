import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { PaginateOptions } from '../../shared/dto';
import { CreateMarcaDto } from './create-marca.dto';

export class FilterMarcaDto extends IntersectionType(
  PartialType(CreateMarcaDto),
  PaginateOptions,
) {}
