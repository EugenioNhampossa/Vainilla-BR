import { Test, TestingModule } from '@nestjs/testing';
import { EntradaStockService } from './entrada-stock.service';

describe('EntradaStockService', () => {
  let service: EntradaStockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntradaStockService],
    }).compile();

    service = module.get<EntradaStockService>(EntradaStockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
