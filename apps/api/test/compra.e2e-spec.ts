import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaModule } from '../src/prisma/prisma.module';
import { ConfigService } from '@nestjs/config';
import { CompraModule } from '../src/compra/compra.module';
import { ArtigoModule } from '../src/artigo/artigo.module';
import { FornecedorModule } from '../src/fornecedor/fornecedor.module';
import { InstalacaoModule } from '../src/instalacao/instalacao.module';
import { StockModule } from '../src/stock/stock.module';
import { Tipo_Instalacao, Unidade } from '@prisma/client';

describe('CompraController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CompraModule,
        ArtigoModule,
        FornecedorModule,
        InstalacaoModule,
        PrismaModule,
        StockModule,
      ],
      providers: [PrismaService, ConfigService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    prisma = app.get(PrismaService);
    await prisma.cleanDB();
  });

  it('compras/ (POST) => 201', async () => {
    const artigo = await request(app.getHttpServer()).post('/artigos').send({
      codigo: 'codigo',
      titulo: 'titulo',
      unidade: Unidade.CX,
      taxaIva: 17,
      codigoBarras: '284983920',
      descricao: 'descricao',
    });

    const fornecedor = await request(app.getHttpServer())
      .post('/fornecedores')
      .send({
        nome: 'nome',
        nuit: '8934090224',
        cell1: '+258845738293',
        cell2: '+258835048201',
        email: 'teste@gmail.com',
      });

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

    await request(app.getHttpServer())
      .post('/compras')
      .expect(201)
      .send({
        id_fornecedor: fornecedor.body.id,
        id_instalacao: instalacao.body.id,
        itens: [
          {
            id_artigo: artigo.body.id,
            quantidade: 10,
            precoUnit: 200,
          },
        ],
      });
  });

  it('compras/ (POST) => should update the stock', async () => {
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

    const artigo = await request(app.getHttpServer()).post('/artigos').send({
      codigo: 'codigo',
      titulo: 'titulo',
      unidade: Unidade.CX,
      taxaIva: 17,
      codigoBarras: '284983920',
      descricao: 'descricao',
    });

    const fornecedor = await request(app.getHttpServer())
      .post('/fornecedores')
      .send({
        nome: 'nome',
        nuit: '8934090224',
        cell1: '+258845738293',
        cell2: '+258835048201',
        email: 'teste@gmail.com',
      });

    await request(app.getHttpServer())
      .post('/compras')
      .send({
        id_fornecedor: fornecedor.body.id,
        id_instalacao: instalacao.body.id,
        itens: [
          {
            id_artigo: artigo.body.id,
            quantidade: 10,
            precoUnit: 200,
          },
        ],
      });

    await request(app.getHttpServer())
      .post('/compras')
      .send({
        id_fornecedor: fornecedor.body.id,
        id_instalacao: instalacao.body.id,
        itens: [
          {
            id_artigo: artigo.body.id,
            quantidade: 5,
            precoUnit: 200,
          },
        ],
      });

    const stock = await request(app.getHttpServer())
      .get(
        `/stock/artigo?id_instalacao=${instalacao.body.id}&id_artigo=${artigo.body.id}`,
      )
      .expect(200);
    expect(stock.body.actual == 15);
  });

  it('compras/ (POST) => should create the stock', async () => {
    const artigo = await request(app.getHttpServer()).post('/artigos').send({
      codigo: 'codigo',
      titulo: 'titulo',
      unidade: Unidade.CX,
      taxaIva: 17,
      codigoBarras: '284983920',
      descricao: 'descricao',
    });

    const fornecedor = await request(app.getHttpServer())
      .post('/fornecedores')
      .send({
        nome: 'nome',
        nuit: '8934090224',
        cell1: '+258845738293',
        cell2: '+258835048201',
        email: 'teste@gmail.com',
      });

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

    await request(app.getHttpServer())
      .post('/compras')
      .send({
        id_fornecedor: fornecedor.body.id,
        id_instalacao: instalacao.body.id,
        itens: [
          {
            id_artigo: artigo.body.id,
            quantidade: 10,
            precoUnit: 200,
          },
        ],
      });

    const stock = await request(app.getHttpServer())
      .get(
        `/stock/artigo?id_instalacao=${instalacao.body.id}&id_artigo=${artigo.body.id}`,
      )
      .expect(200);
    expect(stock.body.actual == 10);
  });

  it('compras/ (POST) => 400 if data not provided', async () => {
    await request(app.getHttpServer()).post('/compras').expect(400);
  });

  it('compras/(GET) => 200', async () => {
    const artigo = await request(app.getHttpServer()).post('/artigos').send({
      codigo: 'codigo',
      titulo: 'titulo',
      unidade: Unidade.CX,
      taxaIva: 17,
      codigoBarras: '284983920',
      descricao: 'descricao',
    });

    const fornecedor = await request(app.getHttpServer())
      .post('/fornecedores')
      .send({
        nome: 'nome',
        nuit: '8934090224',
        cell1: '+258845738293',
        cell2: '+258835048201',
        email: 'teste@gmail.com',
      });

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

    await request(app.getHttpServer())
      .post('/compras')
      .send({
        id_fornecedor: fornecedor.body.id,
        id_instalacao: instalacao.body.id,
        itens: [
          {
            id_artigo: artigo.body.id,
            quantidade: 10,
            precoUnit: 200,
          },
        ],
      });

    const response = await request(app.getHttpServer())
      .get('/compras')
      .expect(200)
      .expect('Content-Type', /json/);
    expect(response.body.data).toHaveLength(1);
  });

  it('compras/:id (GET) => 200', async () => {
    const artigo = await request(app.getHttpServer()).post('/artigos').send({
      codigo: 'codigo',
      titulo: 'titulo',
      unidade: Unidade.CX,
      taxaIva: 17,
      codigoBarras: '284983920',
      descricao: 'descricao',
    });

    const fornecedor = await request(app.getHttpServer())
      .post('/fornecedores')
      .send({
        nome: 'nome',
        nuit: '8934090224',
        cell1: '+258845738293',
        cell2: '+258835048201',
        email: 'teste@gmail.com',
      });

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
      .post('/compras')
      .send({
        id_fornecedor: fornecedor.body.id,
        id_instalacao: instalacao.body.id,
        itens: [
          {
            id_artigo: artigo.body.id,
            quantidade: 10,
            precoUnit: 200,
          },
        ],
      });

    const response = await request(app.getHttpServer())
      .get(`/compras/${create_response.body.id}`)
      .expect(200)
      .expect('Content-Type', /json/);
    expect(response.body).toHaveProperty('id');
  });

  it('compras/:id (GET) => 400 if a non-existent ID is provided', async () => {
    await request(app.getHttpServer())
      .get(`/compras/${'fake_id'}`)
      .expect(404)
      .expect('Content-Type', /json/);
  });
});
