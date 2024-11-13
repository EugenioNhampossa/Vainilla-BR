import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateStockDto } from './create-stock.dto';

export class UpdateStockDto extends OmitType(PartialType(CreateStockDto), [
  'id_instalacao',
  'id_artigo',
] as const) {}
