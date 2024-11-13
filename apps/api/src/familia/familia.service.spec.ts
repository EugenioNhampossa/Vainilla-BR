import { Test, TestingModule } from '@nestjs/testing';
import { FamiliaService } from './familia.service';
import { PrismaService } from '../prisma/prisma.service';

describe('FamiliaService', () => {
  let service: FamiliaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FamiliaService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<FamiliaService>(FamiliaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
