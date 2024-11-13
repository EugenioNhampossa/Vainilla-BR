import { Test, TestingModule } from '@nestjs/testing';
import { MarcaService } from './marca.service';
import { PrismaService } from '../prisma/prisma.service';

describe('MarcaService', () => {
  let service: MarcaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarcaService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<MarcaService>(MarcaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
