import { Module } from '@nestjs/common';
import { SaidaStockService } from './saida-stock.service';
import { SaidaStockController } from './saida-stock.controller';

@Module({
  controllers: [SaidaStockController],
  providers: [SaidaStockService]
})
export class SaidaStockModule {}
