import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { PaginateOptions } from '../../shared/dto';
import { CreateClienteDto } from './create-cliente.dto';

export class FilterClienteDto extends IntersectionType(
  PartialType(CreateClienteDto),
  PaginateOptions,
) {}
