import { Test, TestingModule } from '@nestjs/testing';
import { ArtigoService } from './artigo.service';
import { PrismaService } from '../prisma/prisma.service';
import { Unidade } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

describe('ArtigoService', () => {
  let service: ArtigoService;

  const artigo_mock = {
    id: 'id',
    codigo: 'codigo',
    titulo: 'titulo',
    id_marca: 'id_marca',
    id_subfamilia: 'id_subfamilia',
    unidade: Unidade.CX,
    taxaIva: new Decimal(17),
    codigoBarras: '284983920',
    descricao: 'descricao',
  };

  const prismaMock = {
    $transaction: jest.fn().mockImplementation((dto) => {
      return Promise.resolve(dto);
    }),
    artigo: {
      create: jest.fn().mockImplementation((dto) => {
        return Promise.resolve(dto);
      }),

      update: jest.fn().mockImplementation((args) => {
        return Promise.resolve(args);
      }),

      findFirst: jest.fn().mockImplementation((args) => {
        return Promise.resolve(args);
      }),

      findUniqueOrThrow: jest.fn().mockImplementation((args) => {
        return Promise.resolve(args);
      }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArtigoService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<ArtigoService>(ArtigoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should  create a artigo', async () => {
    await service.create(artigo_mock);
    expect(201);
  });
});
