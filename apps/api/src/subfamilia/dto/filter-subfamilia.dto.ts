import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { PaginateOptions } from '../../shared/dto';
import { CreateSubfamiliaDto } from './create-subfamilia.dto';

export class FilterSubfamilia extends IntersectionType(
  PartialType(CreateSubfamiliaDto),
  PaginateOptions,
) {}
