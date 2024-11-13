import { IntersectionType, OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateCaixaDto } from './create-caixa.dto';
import { PaginateOptions } from '../../shared/dto';

export class FilterCaixaDto extends IntersectionType(
  PartialType(OmitType(CreateCaixaDto, ['status'])),
  PaginateOptions,
) {
  status?: string;
}
