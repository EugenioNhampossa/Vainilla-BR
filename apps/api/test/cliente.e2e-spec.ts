import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaModule } from '../src/prisma/prisma.module';
import { ConfigService } from '@nestjs/config';
import { ClienteModule } from '../src/cliente/cliente.module';

describe('ClienteController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ClienteModule, PrismaModule],
      providers: [PrismaService, ConfigService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    prisma = app.get(PrismaService);
    await prisma.cleanDB();
  });

  it('clientes/ (POST) => 201', async () => {
    await request(app.getHttpServer()).post('/clientes').expect(201).send({
      nome: 'nome',
      nuit: '8934090224',
      cell1: '+258845738293',
      cell2: '+258835048201',
      email: 'teste@gmail.com',
    });
  });

  it('clientes/ (POST) => 400 if provided an existing nuit', async () => {
    await request(app.getHttpServer()).post('/clientes').send({
      nome: 'nome',
      nuit: '8934090224',
      cell1: '+258845738293',
      cell2: '+258835048201',
      email: 'teste@gmail.com',
    });

    await request(app.getHttpServer())
      .post('/clientes')
      .send({
        nome: 'nome',
        nuit: '8934090224',
        cell1: '+258845738293',
        cell2: '+258835048201',
        email: 'teste@gmail.com',
      })
      .expect(400);
  });

  it('clientes/ (POST) => 400 if data not provided', async () => {
    await request(app.getHttpServer()).post('/clientes').expect(400);
  });

  it('clientes/(GET) => 200', async () => {
    await request(app.getHttpServer()).post('/clientes').send({
      nome: 'nome',
      nuit: '8934090224',
      cell1: '+258845738293',
      cell2: '+258835048201',
      email: 'teste@gmail.com',
    });

    const response = await request(app.getHttpServer())
      .get('/clientes')
      .expect(200)
      .expect('Content-Type', /json/);
    expect(response.body.data).toHaveLength(1);
  });

  it('clientes/:id (GET) => 200', async () => {
    const create_response = await request(app.getHttpServer())
      .post('/clientes')
      .send({
        nome: 'nome',
        nuit: '8934090224',
        cell1: '+258845738293',
        cell2: '+258835048201',
        email: 'teste@gmail.com',
      });

    const response = await request(app.getHttpServer())
      .get(`/clientes/${create_response.body.id}`)
      .expect(200)
      .expect('Content-Type', /json/);
    expect(response.body).toHaveProperty('id');
  });

  it('clientes/:id (GET) => 400 if a non-existent ID is provided', async () => {
    await request(app.getHttpServer())
      .get(`/clientes/${'fake_id'}`)
      .expect(404)
      .expect('Content-Type', /json/);
  });

  it('clientes/(PATCH) => 200', async () => {
    const create_response = await request(app.getHttpServer())
      .post('/clientes')
      .send({
        nome: 'nome',
        nuit: '8934090224',
        cell1: '+258845738293',
        cell2: '+258835048201',
        email: 'teste@gmail.com',
      });

    await request(app.getHttpServer())
      .patch(`/clientes/${create_response.body.id}`)
      .send({
        nome: 'nomeUp',
      })
      .expect(200);
  });

  it('clientes/(PATCH) => 404 if a non-existent ID is provided', async () => {
    await request(app.getHttpServer()).patch(`/clientes/${'fake_id'}`).send({
      nome: 'nomeUp',
    });
  });

  it('clientes/(PATCH) => 400 if a existent code is provided', async () => {
    await request(app.getHttpServer()).post('/clientes').send({
      nome: 'nome',
      nuit: '8934090224',
      cell1: '+258845738293',
      cell2: '+258835048201',
      email: 'teste@gmail.com',
    });

    const create_response = await request(app.getHttpServer())
      .post('/clientes')
      .send({
        nome: 'nome',
        nuit: '8934090225',
        cell1: '+258845738293',
        cell2: '+258835048201',
        email: 'teste@gmail.com',
      });

    await request(app.getHttpServer())
      .patch(`/clientes/${create_response.body.id}`)
      .send({
        nuit: '8934090224',
      })
      .expect(400);
  });
});
