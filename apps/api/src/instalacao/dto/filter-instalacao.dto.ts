import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { PaginateOptions } from '../../shared/dto';
import { CreateInstalacaoDto } from './create-instalacao.dto';

export class FilterInstalacaoDto extends IntersectionType(
  PartialType(CreateInstalacaoDto),
  PaginateOptions,
) {}
