import { Test, TestingModule } from '@nestjs/testing';
import { TransferenciaService } from './transferencia.service';
import { PrismaService } from '../prisma/prisma.service';
import { MovimentoService } from '../movimento/movimento.service';

describe('TransferenciaService', () => {
  let service: TransferenciaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransferenciaService,
        { provide: PrismaService, useValue: {} },
        { provide: MovimentoService, useValue: {} },
      ],
    }).compile();

    service = module.get<TransferenciaService>(TransferenciaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
