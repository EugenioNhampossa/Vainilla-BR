import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaModule } from '../src/prisma/prisma.module';
import { ConfigService } from '@nestjs/config';
import { InstalacaoModule } from '../src/instalacao/instalacao.module';
import { Tipo_Instalacao } from '@prisma/client';

describe('InstalacaoController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [InstalacaoModule, PrismaModule],
      providers: [PrismaService, ConfigService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    prisma = app.get(PrismaService);
    await prisma.cleanDB();
  });

  it('instalacoes/ (POST) => 201', async () => {
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
  });

  it('instalacoes/ (POST) => 400 if provided an existing code', async () => {
    await request(app.getHttpServer()).post('/instalacoes').send({
      codigo: 'codigo',
      titulo: 'titulo',
      cidade: 'Maputo',
      codigoPostal: '1114',
      endereco: 'Rua 1011',
      provincia: 'Maputo',
      tipo: Tipo_Instalacao.ARMAZEM,
      descricao: '',
    });

    await request(app.getHttpServer())
      .post('/instalacoes')
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
        cidade: 'Maputo',
        codigoPostal: '1114',
        endereco: 'Rua 1011',
        provincia: 'Maputo',
        tipo: Tipo_Instalacao.ARMAZEM,
        descricao: '',
      })
      .expect(400);
  });

  it('instalacoes/ (POST) => 400 if data not provided', async () => {
    await request(app.getHttpServer()).post('/instalacoes').expect(400);
  });

  it('instalacoes/(GET) => 200', async () => {
    await request(app.getHttpServer()).post('/instalacoes').send({
      codigo: 'codigo',
      titulo: 'titulo',
      cidade: 'Maputo',
      codigoPostal: '1114',
      endereco: 'Rua 1011',
      provincia: 'Maputo',
      tipo: Tipo_Instalacao.ARMAZEM,
      descricao: '',
    });

    const response = await request(app.getHttpServer())
      .get('/instalacoes')
      .expect(200)
      .expect('Content-Type', /json/);
    expect(response.body.data).toHaveLength(1);
  });

  it('instalacoes/:id (GET) => 200', async () => {
    const create_response = await request(app.getHttpServer())
      .post('/instalacoes')
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

    const response = await request(app.getHttpServer())
      .get(`/instalacoes/${create_response.body.id}`)
      .expect(200)
      .expect('Content-Type', /json/);
    expect(response.body).toHaveProperty('id');
  });

  it('instalacoes/:id (GET) => 400 if a non-existent ID is provided', async () => {
    await request(app.getHttpServer())
      .get(`/instalacoes/${'fake_id'}`)
      .expect(404)
      .expect('Content-Type', /json/);
  });

  it('instalacoes/(PATCH) => 200', async () => {
    const create_response = await request(app.getHttpServer())
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

    await request(app.getHttpServer())
      .patch(`/instalacoes/${create_response.body.id}`)
      .send({
        titulo: 'tituloUp',
        cidade: 'Gaza',
      })
      .expect(200);
  });

  it('instalacoes/(PATCH) => 404 if a non-existent ID is provided', async () => {
    await request(app.getHttpServer())
      .patch(`/instalacoes/${'fake_id'}`)
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
      })
      .expect(404);
  });

  it('instalacoes/(PATCH) => 400 if a existent code is provided', async () => {
    await request(app.getHttpServer()).post('/instalacoes').send({
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
      .post('/instalacoes')
      .send({
        id: 'fake_id_2',
        codigo: 'codigo2',
        titulo: 'titulo',
        cidade: 'Maputo',
        codigoPostal: '1114',
        endereco: 'Rua 1011',
        provincia: 'Maputo',
        tipo: Tipo_Instalacao.ARMAZEM,
        descricao: '',
      });

    await request(app.getHttpServer())
      .patch(`/instalacoes/${create_response.body.id}`)
      .send({
        codigo: 'codigo',
      })
      .expect(400);
  });
});
