import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaModule } from '../src/prisma/prisma.module';
import { ConfigService } from '@nestjs/config';
import { ProdutoModule } from '../src/produto/produto.module';
import { CategoriaModule } from '../src/categoria/categoria.module';
import { ArtigoModule } from '../src/artigo/artigo.module';
import { Unidade } from '@prisma/client';

describe('ProdutoController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ProdutoModule, CategoriaModule, ArtigoModule, PrismaModule],
      providers: [PrismaService, ConfigService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    prisma = app.get(PrismaService);
    await prisma.cleanDB();
  });

  it('produtos/ (POST) => 201', async () => {
    const categoria = await request(app.getHttpServer())
      .post('/categorias')
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
      });

    const artigo = await request(app.getHttpServer()).post('/artigos').send({
      codigo: 'codigo',
      titulo: 'titulo',
      unidade: Unidade.CX,
      taxaIva: 17,
      codigoBarras: '284983920',
      descricao: 'descricao',
    });

    await request(app.getHttpServer())
      .post('/produtos')
      .expect(201)
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
        id_categoria: categoria.body.id,
        preco: 100,
        descricao: '',
        itens: [
          {
            id_item: artigo.body.id,
            quantidade: 2,
          },
        ],
      });
  });

  it('produtos/ (POST) => 400 if provided an existent code', async () => {
    const categoria = await request(app.getHttpServer())
      .post('/categorias')
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
      });

    const artigo = await request(app.getHttpServer()).post('/artigos').send({
      codigo: 'codigo',
      titulo: 'titulo',
      unidade: Unidade.CX,
      taxaIva: 17,
      codigoBarras: '284983920',
      descricao: 'descricao',
    });

    await request(app.getHttpServer())
      .post('/produtos')
      .expect(201)
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
        id_categoria: categoria.body.id,
        preco: 100,
        descricao: '',
        itens: [
          {
            id_item: artigo.body.id,
            quantidade: 2,
          },
        ],
      });

    await request(app.getHttpServer())
      .post('/produtos')
      .expect(400)
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
        id_categoria: categoria.body.id,
        preco: 100,
        descricao: '',
        itens: [
          {
            id_item: artigo.body.id,
            quantidade: 2,
          },
        ],
      });
  });

  it('produtos/combo (POST) => 201', async () => {
    const categoria = await request(app.getHttpServer())
      .post('/categorias')
      .expect(201)
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
      });

    const artigo = await request(app.getHttpServer()).post('/artigos').send({
      codigo: 'codigo',
      titulo: 'titulo',
      unidade: Unidade.CX,
      taxaIva: 17,
      codigoBarras: '284983920',
      descricao: 'descricao',
    });

    const produto = await request(app.getHttpServer())
      .post('/produtos')
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
        id_categoria: categoria.body.id,
        preco: 100,
        descricao: '',
        itens: [
          {
            id_item: artigo.body.id,
            quantidade: 2,
          },
        ],
      });

    await request(app.getHttpServer())
      .post('/produtos/combo')
      .expect(201)
      .send({
        codigo: 'codigo_combo',
        titulo: 'titulo_combo',
        id_categoria: categoria.body.id,
        preco: 100,
        descricao: '',
        itens: [
          {
            id_item: produto.body.id,
            quantidade: 2,
          },
        ],
      });
  });

  it('produtos/ (POST) => 400 if data not provided', async () => {
    await request(app.getHttpServer()).post('/produtos').expect(400);
  });

  it('produtos/(GET) => 200', async () => {
    const categoria = await request(app.getHttpServer())
      .post('/categorias')
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
      });

    const artigo = await request(app.getHttpServer()).post('/artigos').send({
      codigo: 'codigo',
      titulo: 'titulo',
      unidade: Unidade.CX,
      taxaIva: 17,
      codigoBarras: '284983920',
      descricao: 'descricao',
    });

    await request(app.getHttpServer())
      .post('/produtos')
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
        id_categoria: categoria.body.id,
        preco: 100,
        descricao: '',
        itens: [
          {
            id_item: artigo.body.id,
            quantidade: 2,
          },
        ],
      });

    const response = await request(app.getHttpServer())
      .get('/produtos')
      .expect(200)
      .expect('Content-Type', /json/);
    expect(response.body.data).toHaveLength(1);
  });

  it('produtos/:id (GET) => 200', async () => {
    const categoria = await request(app.getHttpServer())
      .post('/categorias')
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
      });

    const artigo = await request(app.getHttpServer()).post('/artigos').send({
      codigo: 'codigo',
      titulo: 'titulo',
      unidade: Unidade.CX,
      taxaIva: 17,
      codigoBarras: '284983920',
      descricao: 'descricao',
    });

    const create_response = await request(app.getHttpServer())
      .post('/produtos')
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
        id_categoria: categoria.body.id,
        preco: 100,
        descricao: '',
        itens: [
          {
            id_item: artigo.body.id,
            quantidade: 2,
          },
        ],
      });
    const response = await request(app.getHttpServer())
      .get(`/produtos/${create_response.body.id}`)
      .expect(200)
      .expect('Content-Type', /json/);
    expect(response.body).toHaveProperty('id');
  });

  it('produtos/:id (GET) => 400 if a non-existent ID is provided', async () => {
    await request(app.getHttpServer())
      .get(`/produtos/${'fake_id'}`)
      .expect(404)
      .expect('Content-Type', /json/);
  });

  it('produtos/(PATCH) => 200', async () => {
    const categoria = await request(app.getHttpServer())
      .post('/categorias')
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
      });

    const artigo = await request(app.getHttpServer()).post('/artigos').send({
      codigo: 'codigo',
      titulo: 'titulo',
      unidade: Unidade.CX,
      taxaIva: 17,
      codigoBarras: '284983920',
      descricao: 'descricao',
    });

    const create_response = await request(app.getHttpServer())
      .post('/produtos')
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
        id_categoria: categoria.body.id,
        preco: 100,
        descricao: '',
        itens: [
          {
            id_item: artigo.body.id,
            quantidade: 2,
          },
        ],
      });

    await request(app.getHttpServer())
      .patch(`/produtos/${create_response.body.id}`)
      .send({
        itens: [
          {
            id_item: artigo.body.id,
            quantidade: 10,
          },
        ],
      })
      .expect(200);

    const response = await request(app.getHttpServer())
      .get(`/produtos/${create_response.body.id}`)
      .expect(200)
      .expect('Content-Type', /json/);
    expect(response.body.Produto_Item[0].quantidade == 10);

    await request(app.getHttpServer())
      .patch(`/produtos/${create_response.body.id}`)
      .send({
        codigo: 'nomeUp',
      })
      .expect(200);

    const response_2 = await request(app.getHttpServer())
      .get(`/produtos/${create_response.body.id}`)
      .expect(200)
      .expect('Content-Type', /json/);
    expect(response_2.body.Produto_Item.length == 0);
  });

  it('produtos/(PATCH) => 404 if a non-existent ID is provided', async () => {
    await request(app.getHttpServer()).patch(`/produtos/${'fake_id'}`).send({
      codigo: 'nomeUp',
    });
  });
});
