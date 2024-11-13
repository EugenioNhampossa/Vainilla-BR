import { Test, TestingModule } from '@nestjs/testing';
import { VariacaoStockService } from './variacao-stock.service';

describe('VariacaoStockService', () => {
  let service: VariacaoStockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VariacaoStockService],
    }).compile();

    service = module.get<VariacaoStockService>(VariacaoStockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
