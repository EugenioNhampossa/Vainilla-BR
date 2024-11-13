import { Test, TestingModule } from '@nestjs/testing';
import { CaixaService } from './caixa.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CaixaService', () => {
  let service: CaixaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CaixaService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<CaixaService>(CaixaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
