import { PartialType } from '@nestjs/mapped-types';
import { CreateEntradaStockDto } from './create-entrada-stock.dto';

export class UpdateEntradaStockDto extends PartialType(CreateEntradaStockDto) {}
