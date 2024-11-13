import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaModule } from '../src/prisma/prisma.module';
import { ConfigService } from '@nestjs/config';
import { InstalacaoModule } from '../src/instalacao/instalacao.module';
import { CaixaModule } from '../src/caixa/caixa.module';
import { Tipo_Instalacao } from '@prisma/client';

describe('CaixaController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CaixaModule, PrismaModule, InstalacaoModule],
      providers: [PrismaService, ConfigService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    prisma = app.get(PrismaService);
    await prisma.cleanDB();
  });

  it('caixas/ (POST) => 201', async () => {
    const instalacao = await request(app.getHttpServer())
      .post('/instalacoes')
      .expect(201)
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
        cidade: 'Maputo',
        codigoPostal: '1114',
        endereco: 'Rua 1011',
        provincia: 'Maputo',
        tipo: Tipo_Instalacao.ARMAZEM,
        descricao: '',
      });

    await request(app.getHttpServer()).post('/caixas').expect(201).send({
      codigo: 'codigo',
      id_instalacao: instalacao.body.id,
    });
  });

  it('caixas/ (POST) => 400 if provided an existing code', async () => {
    const instalacao = await request(app.getHttpServer())
      .post('/instalacoes')
      .expect(201)
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
        cidade: 'Maputo',
        codigoPostal: '1114',
        endereco: 'Rua 1011',
        provincia: 'Maputo',
        tipo: Tipo_Instalacao.ARMAZEM,
        descricao: '',
      });

    await request(app.getHttpServer()).post('/caixas').send({
      codigo: 'codigo',
      id_instalacao: instalacao.body.id,
    });

    await request(app.getHttpServer())
      .post('/caixas')
      .send({
        codigo: 'codigo',
        id_instalacao: instalacao.body.id,
      })
      .expect(400);
  });

  it('caixas/ (POST) => 400 if data not provided', async () => {
    await request(app.getHttpServer()).post('/caixas').expect(400);
  });

  it('caixas/(GET) => 200', async () => {
    const instalacao = await request(app.getHttpServer())
      .post('/instalacoes')
      .expect(201)
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
        cidade: 'Maputo',
        codigoPostal: '1114',
        endereco: 'Rua 1011',
        provincia: 'Maputo',
        tipo: Tipo_Instalacao.ARMAZEM,
        descricao: '',
      });

    await request(app.getHttpServer()).post('/caixas').send({
      codigo: 'codigo',
      id_instalacao: instalacao.body.id,
    });

    const response = await request(app.getHttpServer())
      .get('/caixas')
      .expect(200)
      .expect('Content-Type', /json/);
    expect(response.body.data).toHaveLength(1);
  });

  it('artigos/:id (GET) => 200', async () => {
    const instalacao = await request(app.getHttpServer())
      .post('/instalacoes')
      .expect(201)
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
        cidade: 'Maputo',
        codigoPostal: '1114',
        endereco: 'Rua 1011',
        provincia: 'Maputo',
        tipo: Tipo_Instalacao.ARMAZEM,
        descricao: '',
      });

    const create_response = await request(app.getHttpServer())
      .post('/caixas')
      .send({
        codigo: 'codigo',
        id_instalacao: instalacao.body.id,
      });

    const response = await request(app.getHttpServer())
      .get(`/caixas/${create_response.body.id}`)
      .expect(200)
      .expect('Content-Type', /json/);
    expect(response.body).toHaveProperty('id');
  });

  it('caixas/:id (GET) => 400 if a non-existent ID is provided', async () => {
    await request(app.getHttpServer())
      .get(`/caixas/${'fake_id'}`)
      .expect(404)
      .expect('Content-Type', /json/);
  });

  it('caixas/(PATCH) => 200', async () => {
    const instalacao = await request(app.getHttpServer())
      .post('/instalacoes')
      .expect(201)
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
        cidade: 'Maputo',
        codigoPostal: '1114',
        endereco: 'Rua 1011',
        provincia: 'Maputo',
        tipo: Tipo_Instalacao.ARMAZEM,
        descricao: '',
      });

    const create_response = await request(app.getHttpServer())
      .post('/caixas')
      .send({
        codigo: 'codigo',
        id_instalacao: instalacao.body.id,
      });

    await request(app.getHttpServer())
      .patch(`/caixas/${create_response.body.id}`)
      .send({
        codigo: 'codigUp',
      })
      .expect(200);
  });

  it('artigos/(PATCH) => 404 if a non-existent ID is provided', async () => {
    await request(app.getHttpServer()).patch(`/caixas/${'fake_id'}`).send({
      codigo: 'codigoUp',
    });
  });

  it('caixas/(PATCH) => 400 if a existent code is provided', async () => {
    const instalacao = await request(app.getHttpServer())
      .post('/instalacoes')
      .expect(201)
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
        cidade: 'Maputo',
        codigoPostal: '1114',
        endereco: 'Rua 1011',
        provincia: 'Maputo',
        tipo: Tipo_Instalacao.ARMAZEM,
        descricao: '',
      });

    await request(app.getHttpServer()).post('/caixas').send({
      codigo: 'codigo',
      id_instalacao: instalacao.body.id,
    });

    const create_response = await request(app.getHttpServer())
      .post('/caixas')
      .send({
        codigo: 'codigo_2',
        id_instalacao: instalacao.body.id,
      });

    await request(app.getHttpServer())
      .patch(`/caixas/${create_response.body.id}`)
      .send({
        codigo: 'codigo',
      })
      .expect(400);
  });
});
