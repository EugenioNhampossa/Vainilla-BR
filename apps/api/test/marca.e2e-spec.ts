import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaModule } from '../src/prisma/prisma.module';
import { ConfigService } from '@nestjs/config';
import { MarcaModule } from '../src/marca/marca.module';

describe('MarcaController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MarcaModule, PrismaModule],
      providers: [PrismaService, ConfigService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    prisma = app.get(PrismaService);
    await prisma.cleanDB();
  });

  it('marcas/ (POST) => 201', async () => {
    await request(app.getHttpServer()).post('/marcas').expect(201).send({
      titulo: 'titulo',
      descricao: 'desc',
    });
  });

  it('marcas/ (POST) => 400 if provided an existing code', async () => {
    await request(app.getHttpServer()).post('/marcas').send({
      titulo: 'titulo',
      descricao: 'desc',
    });

    await request(app.getHttpServer())
      .post('/marcas')
      .send({
        titulo: 'titulo',
        descricao: 'desc',
      })
      .expect(400);
  });

  it('marcas/ (POST) => 400 if data not provided', async () => {
    await request(app.getHttpServer()).post('/marcas').expect(400);
  });

  it('marcas/(GET) => 200', async () => {
    await request(app.getHttpServer()).post('/marcas').send({
      titulo: 'titulo',
      descricao: 'desc',
    });

    const response = await request(app.getHttpServer())
      .get('/marcas')
      .expect(200)
      .expect('Content-Type', /json/);
    expect(response.body.data).toHaveLength(1);
  });

  it('marcas/:id (GET) => 200', async () => {
    const create_response = await request(app.getHttpServer())
      .post('/marcas')
      .send({
        titulo: 'titulo',
        descricao: 'desc',
      });

    const response = await request(app.getHttpServer())
      .get(`/marcas/${create_response.body.id}`)
      .expect(200)
      .expect('Content-Type', /json/);
    expect(response.body).toHaveProperty('id');
  });

  it('marcas/:id (GET) => 400 if a non-existent ID is provided', async () => {
    await request(app.getHttpServer())
      .get(`/marcas/${'fake_id'}`)
      .expect(404)
      .expect('Content-Type', /json/);
  });

  it('marcas/(PATCH) => 200', async () => {
    const create_response = await request(app.getHttpServer())
      .post('/marcas')
      .send({
        titulo: 'titulo',
        descricao: 'desc',
      });

    await request(app.getHttpServer())
      .patch(`/marcas/${create_response.body.id}`)
      .send({
        titulo: 'nomeUp',
      })
      .expect(200);
  });

  it('marcas/(PATCH) => 404 if a non-existent ID is provided', async () => {
    await request(app.getHttpServer()).patch(`/marcas/${'fake_id'}`).send({
      titulo: 'nomeUp',
    });
  });

  it('marcas/(PATCH) => 400 if a existent code is provided', async () => {
    await request(app.getHttpServer()).post('/marcas').send({
      titulo: 'titulo',
      descricao: 'desc',
    });

    const create_response = await request(app.getHttpServer())
      .post('/marcas')
      .send({
        titulo: 'titulo_2',
        descricao: 'desc',
      });

    await request(app.getHttpServer())
      .patch(`/marcas/${create_response.body.id}`)
      .send({
        titulo: 'titulo',
      })
      .expect(400);
  });
});
