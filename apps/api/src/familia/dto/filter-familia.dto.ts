import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { PaginateOptions } from '../../shared/dto';
import { CreateFamiliaDto } from './create-familia.dto';

export class FilterFamiliaDto extends IntersectionType(
  PartialType(CreateFamiliaDto),
  PaginateOptions,
) {}
