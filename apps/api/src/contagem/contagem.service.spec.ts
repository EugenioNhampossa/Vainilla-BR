import { Test, TestingModule } from '@nestjs/testing';
import { ContagemService } from './contagem.service';

describe('ContagemService', () => {
  let service: ContagemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContagemService],
    }).compile();

    service = module.get<ContagemService>(ContagemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
