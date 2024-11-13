import { Controller, Get, Query } from '@nestjs/common';
import { VariacaoStockService } from './variacao-stock.service';
import { FilterVariacaoDto } from './dto/filter-variacao.dto';

@Controller('variacao-stock')
export class VariacaoStockController {
  constructor(private readonly variacaoStockService: VariacaoStockService) {}

  @Get()
  findAll(@Query() filter: FilterVariacaoDto) {
    return this.variacaoStockService.getStockVariance(filter);
  }
}
