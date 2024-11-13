import { PartialType } from '@nestjs/mapped-types';
import { CreateSaidaStockDto } from './create-saida-stock.dto';

export class UpdateSaidaStockDto extends PartialType(CreateSaidaStockDto) {}
