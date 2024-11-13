import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaModule } from '../src/prisma/prisma.module';
import { ConfigService } from '@nestjs/config';
import { FamiliaModule } from '../src/familia/familia.module';

describe('FamiliaController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [FamiliaModule, PrismaModule],
      providers: [PrismaService, ConfigService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    prisma = app.get(PrismaService);
    await prisma.cleanDB();
  });

  it('familias/ (POST) => 201', async () => {
    await request(app.getHttpServer()).post('/familias').expect(201).send({
      codigo: 'codigo',
      titulo: 'titulo',
      descricao: 'desc',
    });
  });

  it('familias/ (POST) => 400 if provided an existing code', async () => {
    await request(app.getHttpServer()).post('/familias').send({
      codigo: 'codigo',
      titulo: 'titulo',
      descricao: 'desc',
    });

    await request(app.getHttpServer())
      .post('/familias')
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
        descricao: 'desc',
      })
      .expect(400);
  });

  it('familias/ (POST) => 400 if data not provided', async () => {
    await request(app.getHttpServer()).post('/familias').expect(400);
  });

  it('familias/(GET) => 200', async () => {
    await request(app.getHttpServer()).post('/familias').send({
      codigo: 'codigo',
      titulo: 'titulo',
      descricao: 'desc',
    });

    const response = await request(app.getHttpServer())
      .get('/familias')
      .expect(200)
      .expect('Content-Type', /json/);
    expect(response.body.data).toHaveLength(1);
  });

  it('familias/:id (GET) => 200', async () => {
    const create_response = await request(app.getHttpServer())
      .post('/familias')
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
        descricao: 'desc',
      });

    const response = await request(app.getHttpServer())
      .get(`/familias/${create_response.body.id}`)
      .expect(200)
      .expect('Content-Type', /json/);
    expect(response.body).toHaveProperty('id');
  });

  it('familias/:id (GET) => 400 if a non-existent ID is provided', async () => {
    await request(app.getHttpServer())
      .get(`/familias/${'fake_id'}`)
      .expect(404)
      .expect('Content-Type', /json/);
  });

  it('familias/(PATCH) => 200', async () => {
    const create_response = await request(app.getHttpServer())
      .post('/familias')
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
        descricao: 'desc',
      });

    await request(app.getHttpServer())
      .patch(`/familias/${create_response.body.id}`)
      .send({
        titulo: 'nomeUp',
      })
      .expect(200);
  });

  it('familias/(PATCH) => 404 if a non-existent ID is provided', async () => {
    await request(app.getHttpServer()).patch(`/familias/${'fake_id'}`).send({
      nome: 'nomeUp',
    });
  });

  it('familias/(PATCH) => 400 if a existent code is provided', async () => {
    await request(app.getHttpServer()).post('/familias').send({
      codigo: 'codigo',
      titulo: 'titulo',
      descricao: 'desc',
    });

    const create_response = await request(app.getHttpServer())
      .post('/familias')
      .send({
        codigo: 'codigo_2',
        titulo: 'titulo',
        descricao: 'desc',
      });

    await request(app.getHttpServer())
      .patch(`/familias/${create_response.body.id}`)
      .send({
        codigo: 'codigo',
      })
      .expect(400);
  });
});
