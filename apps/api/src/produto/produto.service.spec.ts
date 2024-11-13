import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoService } from './produto.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProdutoService', () => {
  let service: ProdutoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProdutoService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<ProdutoService>(ProdutoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
