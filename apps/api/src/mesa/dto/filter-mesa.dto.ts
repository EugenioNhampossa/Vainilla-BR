import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { CreateMesaDto } from './create-mesa.dto';
import { PaginateOptions } from '../../shared/dto';

export class FilterMesaDto extends IntersectionType(
  PartialType(CreateMesaDto),
  PaginateOptions,
) {}
