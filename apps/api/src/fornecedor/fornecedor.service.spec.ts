import { Test, TestingModule } from '@nestjs/testing';
import { FornecedorService } from './fornecedor.service';
import { PrismaService } from '../prisma/prisma.service';

describe('FornecedorService', () => {
  let service: FornecedorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FornecedorService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<FornecedorService>(FornecedorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
