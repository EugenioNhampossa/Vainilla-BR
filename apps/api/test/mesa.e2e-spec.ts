import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaModule } from '../src/prisma/prisma.module';
import { ConfigService } from '@nestjs/config';
import { MesaModule } from '../src/mesa/mesa.module';
import { Tipo_Instalacao } from '@prisma/client';
import { InstalacaoModule } from '../src/instalacao/instalacao.module';

describe('MesaController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MesaModule, InstalacaoModule, PrismaModule],
      providers: [PrismaService, ConfigService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    prisma = app.get(PrismaService);
    await prisma.cleanDB();
  });

  it('mesas/ (POST) => 201', async () => {
    const instalacao = await request(app.getHttpServer())
      .post('/instalacoes')
      .send({
        id: 'fake_id',
        codigo: 'codigo',
        titulo: 'titulo',
        cidade: 'Maputo',
        codigoPostal: '1114',
        endereco: 'Rua 1011',
        provincia: 'Maputo',
        tipo: Tipo_Instalacao.ARMAZEM,
        descricao: '',
      });

    await request(app.getHttpServer()).post('/mesas').expect(201).send({
      codigo: 'codigo',
      id_instalacao: instalacao.body.id,
    });
  });

  it('mesas/ (POST) => 400 if data not provided', async () => {
    await request(app.getHttpServer()).post('/mesas').expect(400);
  });

  it('mesas/(GET) => 200', async () => {
    const instalacao = await request(app.getHttpServer())
      .post('/instalacoes')
      .send({
        id: 'fake_id',
        codigo: 'codigo',
        titulo: 'titulo',
        cidade: 'Maputo',
        codigoPostal: '1114',
        endereco: 'Rua 1011',
        provincia: 'Maputo',
        tipo: Tipo_Instalacao.ARMAZEM,
        descricao: '',
      });

    await request(app.getHttpServer()).post('/mesas').send({
      codigo: 'codigo',
      id_instalacao: instalacao.body.id,
    });

    const response = await request(app.getHttpServer())
      .get('/mesas')
      .expect(200)
      .expect('Content-Type', /json/);
    expect(response.body.data).toHaveLength(1);
  });

  it('mesas/:id (GET) => 200', async () => {
    const instalacao = await request(app.getHttpServer())
      .post('/instalacoes')
      .send({
        id: 'fake_id',
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
      .post('/mesas')
      .send({
        codigo: 'codigo',
        id_instalacao: instalacao.body.id,
      });

    const response = await request(app.getHttpServer())
      .get(`/mesas/${create_response.body.id}`)
      .expect(200)
      .expect('Content-Type', /json/);
    expect(response.body).toHaveProperty('id');
  });

  it('mesas/:id (GET) => 400 if a non-existent ID is provided', async () => {
    await request(app.getHttpServer())
      .get(`/mesas/${'fake_id'}`)
      .expect(404)
      .expect('Content-Type', /json/);
  });

  it('mesas/(PATCH) => 200', async () => {
    const instalacao = await request(app.getHttpServer())
      .post('/instalacoes')
      .send({
        id: 'fake_id',
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
      .post('/mesas')
      .send({
        codigo: 'codigo',
        id_instalacao: instalacao.body.id,
      });

    await request(app.getHttpServer())
      .patch(`/mesas/${create_response.body.id}`)
      .send({
        codigo: 'nomeUp',
      })
      .expect(200);
  });

  it('mesas/(PATCH) => 404 if a non-existent ID is provided', async () => {
    await request(app.getHttpServer()).patch(`/mesas/${'fake_id'}`).send({
      codigo: 'nomeUp',
    });
  });
});
