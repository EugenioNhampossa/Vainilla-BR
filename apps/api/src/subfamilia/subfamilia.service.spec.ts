import { Test, TestingModule } from '@nestjs/testing';
import { SubfamiliaService } from './subfamilia.service';
import { PrismaService } from '../prisma/prisma.service';

describe('SubfamiliaService', () => {
  let service: SubfamiliaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubfamiliaService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<SubfamiliaService>(SubfamiliaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
