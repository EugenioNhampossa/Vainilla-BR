import { Test, TestingModule } from '@nestjs/testing';
import { ArtigoController } from './artigo.controller';
import { ArtigoService } from './artigo.service';
import { Unidade } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

describe('ArtigoController', () => {
  let controller: ArtigoController;

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

  const artigo_service_mock = {
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
    findAll: jest.fn().mockImplementation(() => [artigo_mock]),

    findOne: jest.fn().mockImplementation((id) => {
      return Promise.resolve({
        id: id,
        ...artigo_mock,
      });
    }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtigoController],
      providers: [ArtigoService],
    })
      .overrideProvider(ArtigoService)
      .useValue(artigo_service_mock)
      .compile();

    controller = module.get<ArtigoController>(ArtigoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return the created artigo', async () => {
    const result = await controller.create(artigo_mock);
    expect(201);
    expect(result).toEqual({
      id: 'fake_id',
      ...artigo_mock,
    });
  });

  it('should return the updated artigo', async () => {
    const id = 'fake_id';
    const result = await controller.update(id, artigo_mock);
    expect(201);
    expect(result).toEqual({
      id: 'fake_id',
      ...artigo_mock,
    });
  });

  it('should return a artigo that has the specified id', async () => {
    const result = await controller.findOne(artigo_mock.id);
    expect(200);
    expect(result).toEqual({
      id: 'fake_id',
      ...artigo_mock,
    });
  });

  it('should return an array of artigos', async () => {
    const result = await controller.findAll({
      ...artigo_mock,
      id_familia: 'id_familia',
    });
    expect(200);
    expect(result).toHaveLength(1);
  });
});
