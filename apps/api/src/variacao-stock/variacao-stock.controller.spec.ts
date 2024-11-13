import { Test, TestingModule } from '@nestjs/testing';
import { VariacaoStockController } from './variacao-stock.controller';
import { VariacaoStockService } from './variacao-stock.service';

describe('VariacaoStockController', () => {
  let controller: VariacaoStockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VariacaoStockController],
      providers: [VariacaoStockService],
    }).compile();

    controller = module.get<VariacaoStockController>(VariacaoStockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
