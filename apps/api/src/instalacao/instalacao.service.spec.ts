import { Test, TestingModule } from '@nestjs/testing';
import { InstalacaoService } from './instalacao.service';
import { PrismaService } from '../prisma/prisma.service';
import { Tipo_Instalacao } from '@prisma/client';

describe('InstalacaoService', () => {
  let service: InstalacaoService;

  const instalacao_mock = {
    id: 'fake_id',
    codigo: 'codigo',
    titulo: 'titulo',
    cidade: 'Maputo',
    codigoPostal: '1114',
    endereco: 'Rua 1011',
    provincia: 'Maputo',
    tipo: Tipo_Instalacao.ARMAZEM,
    descricao: '',
  };

  const prismaMock = {
    instalacao: {
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
        InstalacaoService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<InstalacaoService>(InstalacaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should  create a instalacao', async () => {
    await service.create(instalacao_mock);
    expect(201);
  });

  it('should update a instalacao', async () => {
    const id = 'fake_id';
    await service.update(id, instalacao_mock);
    expect(200);
  });

  it('should return a instalacao that has the specified id', async () => {
    const result = await service.findOne(instalacao_mock.id);
    expect(200);
    expect(result).toHaveProperty('where');
  });
});
