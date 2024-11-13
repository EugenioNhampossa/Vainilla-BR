import { Test, TestingModule } from '@nestjs/testing';
import { EntradaStockController } from './entrada-stock.controller';
import { EntradaStockService } from './entrada-stock.service';

describe('EntradaStockController', () => {
  let controller: EntradaStockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntradaStockController],
      providers: [EntradaStockService],
    }).compile();

    controller = module.get<EntradaStockController>(EntradaStockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
