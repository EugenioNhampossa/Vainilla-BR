import { Module } from '@nestjs/common';
import { VariacaoStockService } from './variacao-stock.service';
import { VariacaoStockController } from './variacao-stock.controller';

@Module({
  controllers: [VariacaoStockController],
  providers: [VariacaoStockService]
})
export class VariacaoStockModule {}
