import { Module } from '@nestjs/common';
import { EntradaStockService } from './entrada-stock.service';
import { EntradaStockController } from './entrada-stock.controller';

@Module({
  controllers: [EntradaStockController],
  providers: [EntradaStockService]
})
export class EntradaStockModule {}
