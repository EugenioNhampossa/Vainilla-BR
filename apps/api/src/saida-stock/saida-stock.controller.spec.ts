import { Test, TestingModule } from '@nestjs/testing';
import { SaidaStockController } from './saida-stock.controller';
import { SaidaStockService } from './saida-stock.service';

describe('SaidaStockController', () => {
  let controller: SaidaStockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaidaStockController],
      providers: [SaidaStockService],
    }).compile();

    controller = module.get<SaidaStockController>(SaidaStockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
