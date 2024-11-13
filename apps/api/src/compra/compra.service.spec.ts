import { Test, TestingModule } from '@nestjs/testing';
import { CompraService } from './compra.service';
import { PrismaService } from '../prisma/prisma.service';
import { MovimentoService } from '../movimento/movimento.service';

describe('CompraService', () => {
  let service: CompraService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompraService,
        { provide: PrismaService, useValue: {} },
        { provide: MovimentoService, useValue: {} },
      ],
    }).compile();

    service = module.get<CompraService>(CompraService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
