import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaModule } from '../src/prisma/prisma.module';
import { ConfigService } from '@nestjs/config';
import { ArtigoModule } from '../src/artigo/artigo.module';
import { Tipo_Instalacao, Unidade } from '@prisma/client';
import { InstalacaoModule } from '../src/instalacao/instalacao.module';
import { StockModule } from '../src/stock/stock.module';

describe('ArtigoController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ArtigoModule, PrismaModule, InstalacaoModule, StockModule],
      providers: [PrismaService, ConfigService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    prisma = app.get(PrismaService);
    await prisma.cleanDB();
  });

  it('artigos/ (POST) => 201', async () => {
    await request(app.getHttpServer()).post('/artigos').expect(201).send({
      codigo: 'codigo',
      titulo: 'titulo',
      unidade: Unidade.CX,
      taxaIva: 17,
      codigoBarras: '284983920',
      descricao: 'descricao',
    });
  });

  it('should create a stock', async () => {
    await request(app.getHttpServer()).post('/instalacoes').expect(201).send({
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
      .post('/artigos')
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
        unidade: Unidade.CX,
        taxaIva: 17,
        codigoBarras: '284983920',
        descricao: 'descricao',
      });

    const response = await request(app.getHttpServer())
      .get('/stock')
      .expect(200)
      .expect('Content-Type', /json/);
    expect(response.body.data[0].id_artigo).toBe(create_response.body.id);
  });

  it('artigos/ (POST) => 400 if provided an existing code', async () => {
    await request(app.getHttpServer()).post('/artigos').send({
      codigo: 'codigo',
      titulo: 'titulo',
      unidade: Unidade.CX,
      taxaIva: 17,
      codigoBarras: '284983920',
      descricao: 'descricao',
    });

    await request(app.getHttpServer())
      .post('/artigos')
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
        unidade: Unidade.CX,
        taxaIva: 17,
        codigoBarras: '284983920',
        descricao: 'descricao',
      })
      .expect(400);
  });

  it('artigos/ (POST) => 400 if data not provided', async () => {
    await request(app.getHttpServer()).post('/artigos').expect(400);
  });

  it('artigos/(GET) => 200', async () => {
    await request(app.getHttpServer()).post('/artigos').send({
      codigo: 'codigo',
      titulo: 'titulo',
      unidade: Unidade.CX,
      taxaIva: 17,
      codigoBarras: '284983920',
      descricao: 'descricao',
    });

    const response = await request(app.getHttpServer())
      .get('/artigos')
      .expect(200)
      .expect('Content-Type', /json/);
    expect(response.body.data).toHaveLength(1);
  });

  it('artigos/:id (GET) => 200', async () => {
    const create_response = await request(app.getHttpServer())
      .post('/artigos')
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
        unidade: Unidade.CX,
        taxaIva: 17,
        codigoBarras: '284983920',
        descricao: 'descricao',
      });

    const response = await request(app.getHttpServer())
      .get(`/artigos/${create_response.body.id}`)
      .expect(200)
      .expect('Content-Type', /json/);
    expect(response.body).toHaveProperty('id');
  });

  it('artigos/barcode/:codBarras/(GET) => 200', async () => {
    await request(app.getHttpServer()).post('/artigos').send({
      codigo: 'codigo',
      titulo: 'titulo',
      unidade: Unidade.CX,
      taxaIva: 17,
      codigoBarras: '284983920',
      descricao: 'descricao',
    });

    const response = await request(app.getHttpServer())
      .get('/artigos/barCode/284983920')
      .expect(200)
      .expect('Content-Type', /json/);
    expect(response.body.codigoBarras).toBe('284983920');
  });

  it('artigos/:id (GET) => 400 if a non-existent ID is provided', async () => {
    await request(app.getHttpServer())
      .get(`/artigos/${'fake_id'}`)
      .expect(404)
      .expect('Content-Type', /json/);
  });

  it('artigos/(PATCH) => 200', async () => {
    const create_response = await request(app.getHttpServer())
      .post('/artigos')
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
        unidade: Unidade.CX,
        taxaIva: 17,
        codigoBarras: '284983920',
        descricao: 'descricao',
      });

    await request(app.getHttpServer())
      .patch(`/artigos/${create_response.body.id}`)
      .send({
        titulo: 'tituloUp',
        descricao: 'descricaoUP',
      })
      .expect(200);
  });

  it('artigos/(PATCH) => 404 if a non-existent ID is provided', async () => {
    await request(app.getHttpServer())
      .patch(`/artigos/${'fake_id'}`)
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
        unidade: Unidade.CX,
        taxaIva: 17,
        codigoBarras: '284983920',
        descricao: 'descricao',
      })
      .expect(404);
  });

  it('artigos/(PATCH) => 400 if a existent code is provided', async () => {
    await request(app.getHttpServer()).post('/artigos').send({
      codigo: 'codigo',
      titulo: 'titulo',
      unidade: Unidade.CX,
      taxaIva: 17,
      codigoBarras: '284983920',
      descricao: 'descricao',
    });

    const create_response = await request(app.getHttpServer())
      .post('/artigos')
      .send({
        codigo: 'codigo_2',
        titulo: 'titulo_2',
        unidade: Unidade.CX,
        taxaIva: 17,
        codigoBarras: '385983920',
        descricao: 'descricao',
      });

    await request(app.getHttpServer())
      .patch(`/artigos/${create_response.body.id}`)
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
      })
      .expect(400);
  });
});
