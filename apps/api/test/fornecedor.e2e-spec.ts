import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaModule } from '../src/prisma/prisma.module';
import { ConfigService } from '@nestjs/config';
import { FornecedorModule } from '../src/fornecedor/fornecedor.module';

describe('FornecedorController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [FornecedorModule, PrismaModule],
      providers: [PrismaService, ConfigService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    prisma = app.get(PrismaService);
    await prisma.cleanDB();
  });

  it('fornecedores/ (POST) => 201', async () => {
    await request(app.getHttpServer()).post('/fornecedores').expect(201).send({
      nome: 'nome',
      nuit: '8934090224',
      cell1: '+258845738293',
      cell2: '+258835048201',
      email: 'teste@gmail.com',
    });
  });

  it('fornecedores/ (POST) => 400 if provided an existing nuit', async () => {
    await request(app.getHttpServer()).post('/fornecedores').send({
      nome: 'nome',
      nuit: '8934090224',
      cell1: '+258845738293',
      cell2: '+258835048201',
      email: 'teste@gmail.com',
    });

    await request(app.getHttpServer())
      .post('/fornecedores')
      .send({
        nome: 'nome',
        nuit: '8934090224',
        cell1: '+258845738293',
        cell2: '+258835048201',
        email: 'teste@gmail.com',
      })
      .expect(400);
  });

  it('fornecedores/ (POST) => 400 if data not provided', async () => {
    await request(app.getHttpServer()).post('/fornecedores').expect(400);
  });

  it('fornecedores/(GET) => 200', async () => {
    await request(app.getHttpServer()).post('/fornecedores').send({
      nome: 'nome',
      nuit: '8934090224',
      cell1: '+258845738293',
      cell2: '+258835048201',
      email: 'teste@gmail.com',
    });

    const response = await request(app.getHttpServer())
      .get('/fornecedores')
      .expect(200)
      .expect('Content-Type', /json/);
    expect(response.body.data).toHaveLength(1);
  });

  it('fornecedores/:id (GET) => 200', async () => {
    const create_response = await request(app.getHttpServer())
      .post('/fornecedores')
      .send({
        nome: 'nome',
        nuit: '8934090224',
        cell1: '+258845738293',
        cell2: '+258835048201',
        email: 'teste@gmail.com',
      });
    const response = await request(app.getHttpServer())
      .get(`/fornecedores/${create_response.body.id}`)
      .expect(200)
      .expect('Content-Type', /json/);
    expect(response.body).toHaveProperty('id');
  });

  it('fornecedores/:id (GET) => 400 if a non-existent ID is provided', async () => {
    await request(app.getHttpServer())
      .get(`/fornecedores/${'fake_id'}`)
      .expect(404)
      .expect('Content-Type', /json/);
  });

  it('fornecedores/(PATCH) => 200', async () => {
    const create_response = await request(app.getHttpServer())
      .post('/fornecedores')
      .send({
        nome: 'nome',
        nuit: '8934090224',
        cell1: '+258845738293',
        cell2: '+258835048201',
        email: 'teste@gmail.com',
      });

    await request(app.getHttpServer())
      .patch(`/fornecedores/${create_response.body.id}`)
      .send({
        nome: 'nomeUp',
      })
      .expect(200);
  });

  it('fornecedores/(PATCH) => 404 if a non-existent ID is provided', async () => {
    await request(app.getHttpServer())
      .patch(`/fornecedores/${'fake_id'}`)
      .send({
        nome: 'nomeUp',
      });
  });

  it('fornecedores/(PATCH) => 400 if a existent code is provided', async () => {
    await request(app.getHttpServer()).post('/fornecedores').send({
      nome: 'nome',
      nuit: '8934090224',
      cell1: '+258845738293',
      cell2: '+258835048201',
      email: 'teste@gmail.com',
    });

    const create_response = await request(app.getHttpServer())
      .post('/fornecedores')
      .send({
        nome: 'nome',
        nuit: '8934090225',
        cell1: '+258845738293',
        cell2: '+258835048201',
        email: 'teste@gmail.com',
      });

    await request(app.getHttpServer())
      .patch(`/fornecedores/${create_response.body.id}`)
      .send({
        nuit: '8934090224',
      })
      .expect(400);
  });
});
