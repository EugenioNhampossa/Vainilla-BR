import { Test, TestingModule } from '@nestjs/testing';
import { InstalacaoController } from './instalacao.controller';
import { InstalacaoService } from './instalacao.service';
import { Tipo_Instalacao } from '@prisma/client';

describe('InstalacaoController', () => {
  let controller: InstalacaoController;

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

  const instalacao_service_mock = {
    create: jest.fn().mockImplementation((dto) => {
      return Promise.resolve({
        id: 'fake_id',
        ...dto,
      });
    }),
    update: jest.fn().mockImplementation((id, dto) => {
      return Promise.resolve({
        id: id,
        ...dto,
      });
    }),
    findAll: jest.fn().mockImplementation(() => [instalacao_mock]),

    findOne: jest.fn().mockImplementation((id) => {
      return Promise.resolve({
        id: id,
        ...instalacao_mock,
      });
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstalacaoController],
      providers: [InstalacaoService],
    })
      .overrideProvider(InstalacaoService)
      .useValue(instalacao_service_mock)
      .compile();

    controller = module.get<InstalacaoController>(InstalacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return the created instalacao', async () => {
    const result = await controller.create(instalacao_mock);
    expect(201);
    expect(result).toEqual({
      id: 'fake_id',
      ...instalacao_mock,
    });
  });

  it('should return the updated instalacao', async () => {
    const id = 'fake_id';
    const result = await controller.update(id, instalacao_mock);
    expect(201);
    expect(result).toEqual({
      id: 'fake_id',
      ...instalacao_mock,
    });
  });

  it('should return a instalacao that has the specified id', async () => {
    const result = await controller.findOne(instalacao_mock.id);
    expect(200);
    expect(result).toEqual({
      id: 'fake_id',
      ...instalacao_mock,
    });
  });

  it('should return an array of instalações', async () => {
    const result = await controller.findAll(instalacao_mock);
    expect(200);
    expect(result).toHaveLength(1);
  });
});
