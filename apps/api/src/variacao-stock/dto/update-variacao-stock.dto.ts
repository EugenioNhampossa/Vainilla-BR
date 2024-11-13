import { PartialType } from '@nestjs/mapped-types';
import { CreateVariacaoStockDto } from './create-variacao-stock.dto';

export class UpdateVariacaoStockDto extends PartialType(CreateVariacaoStockDto) {}
