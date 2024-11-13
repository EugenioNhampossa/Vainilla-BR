import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaModule } from '../src/prisma/prisma.module';
import { ConfigService } from '@nestjs/config';
import { CategoriaModule } from '../src/categoria/categoria.module';

describe('CategoriaController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CategoriaModule, PrismaModule],
      providers: [PrismaService, ConfigService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    prisma = app.get(PrismaService);
    await prisma.cleanDB();
  });

  it('categorias/ (POST) => 201', async () => {
    await request(app.getHttpServer()).post('/categorias').expect(201).send({
      codigo: 'codigo',
      titulo: 'titulo',
    });
  });

  it('categorias/ (POST) => 400 if provided an existing code', async () => {
    await request(app.getHttpServer()).post('/categorias').send({
      codigo: 'codigo',
      titulo: 'titulo',
    });

    await request(app.getHttpServer())
      .post('/categorias')
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
      })
      .expect(400);
  });

  it('categorias/ (POST) => 400 if data not provided', async () => {
    await request(app.getHttpServer()).post('/categorias').expect(400);
  });

  it('categorias/(GET) => 200', async () => {
    await request(app.getHttpServer()).post('/categorias').send({
      codigo: 'codigo',
      titulo: 'titulo',
    });

    const response = await request(app.getHttpServer())
      .get('/categorias')
      .expect(200)
      .expect('Content-Type', /json/);
    expect(response.body.data).toHaveLength(1);
  });

  it('categorias/:id (GET) => 200', async () => {
    const create_response = await request(app.getHttpServer())
      .post('/categorias')
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
      });

    const response = await request(app.getHttpServer())
      .get(`/categorias/${create_response.body.id}`)
      .expect(200)
      .expect('Content-Type', /json/);
    expect(response.body).toHaveProperty('id');
  });

  it('categorias/:id (GET) => 400 if a non-existent ID is provided', async () => {
    await request(app.getHttpServer())
      .get(`/categorias/${'fake_id'}`)
      .expect(404)
      .expect('Content-Type', /json/);
  });

  it('categorias/(PATCH) => 200', async () => {
    const create_response = await request(app.getHttpServer())
      .post('/categorias')
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
      });

    await request(app.getHttpServer())
      .patch(`/categorias/${create_response.body.id}`)
      .send({
        titulo: 'nomeUp',
      })
      .expect(200);
  });

  it('categorias/(PATCH) => 404 if a non-existent ID is provided', async () => {
    await request(app.getHttpServer()).patch(`/categorias/${'fake_id'}`).send({
      titulo: 'nomeUp',
    });
  });

  it('categorias/(PATCH) => 400 if a existent code is provided', async () => {
    await request(app.getHttpServer()).post('/categorias').send({
      codigo: 'codigo',
      titulo: 'titulo',
    });

    const create_response = await request(app.getHttpServer())
      .post('/categorias')
      .send({
        codigo: 'codigo_2',
        titulo: 'titulo_2',
      });

    await request(app.getHttpServer())
      .patch(`/categorias/${create_response.body.id}`)
      .send({
        codigo: 'codigo',
      })
      .expect(400);
  });
});
