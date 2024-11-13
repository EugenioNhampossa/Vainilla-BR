import { Test, TestingModule } from '@nestjs/testing';
import { SaidaStockService } from './saida-stock.service';

describe('SaidaStockService', () => {
  let service: SaidaStockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SaidaStockService],
    }).compile();

    service = module.get<SaidaStockService>(SaidaStockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
