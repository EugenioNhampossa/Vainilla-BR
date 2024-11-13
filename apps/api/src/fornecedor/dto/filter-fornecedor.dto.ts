import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { PaginateOptions } from '../../shared/dto';
import { CreateFornecedorDto } from './create-fornecedor.dto';

export class FilterFornecedorDto extends IntersectionType(
  PartialType(CreateFornecedorDto),
  PaginateOptions,
) {}
