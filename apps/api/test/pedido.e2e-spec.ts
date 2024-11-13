import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaModule } from '../src/prisma/prisma.module';
import { ConfigService } from '@nestjs/config';
import { PedidoModule } from '../src/pedido/pedido.module';
import { ClienteModule } from '../src/cliente/cliente.module';
import { StockModule } from '../src/stock/stock.module';
import { CompraModule } from '../src/compra/compra.module';
import { InstalacaoModule } from '../src/instalacao/instalacao.module';
import { FornecedorModule } from '../src/fornecedor/fornecedor.module';
import { ProdutoModule } from '../src/produto/produto.module';
import { ArtigoModule } from '../src/artigo/artigo.module';
import { Tipo_Instalacao, Tipo_Pagamento, Unidade } from '@prisma/client';
import { CategoriaModule } from '../src/categoria/categoria.module';

describe('PedidoController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        PedidoModule,
        ClienteModule,
        StockModule,
        CompraModule,
        InstalacaoModule,
        FornecedorModule,
        ProdutoModule,
        CategoriaModule,
        ArtigoModule,
        PrismaModule,
      ],
      providers: [PrismaService, ConfigService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    prisma = app.get(PrismaService);
    await prisma.cleanDB();
  });

  it('pedidos/ (POST) => 201', async () => {
    const instalacao = await request(app.getHttpServer())
      .post('/instalacoes')
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
        cidade: 'Maputo',
        codigoPostal: '1114',
        endereco: 'Rua 1011',
        provincia: 'Maputo',
        tipo: Tipo_Instalacao.RESTAURANTE,
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

    const categoria = await request(app.getHttpServer())
      .post('/categorias')
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
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

    const cliente = await request(app.getHttpServer()).post('/clientes').send({
      nome: 'nome',
      nuit: '8934090224',
      cell1: '+258845738293',
      cell2: '+258835048201',
      email: 'teste@gmail.com',
    });

    await request(app.getHttpServer())
      .post('/pedidos')
      .expect(201)
      .send({
        id_cliente: cliente.body.id,
        id_instalacao: instalacao.body.id,
        codigo: '1644',
        desconto: 10,
        tipoPagamento: Tipo_Pagamento.CASH,
        itens: [
          {
            id_produto: produto.body.id,
            quantidade: 2,
            desconto: 10,
          },
        ],
      });
  });

  it('pedidos/ (POST) => it should update the combo product stock', async () => {
    const instalacao = await request(app.getHttpServer())
      .post('/instalacoes')
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
        cidade: 'Maputo',
        codigoPostal: '1114',
        endereco: 'Rua 1011',
        provincia: 'Maputo',
        tipo: Tipo_Instalacao.RESTAURANTE,
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

    const categoria = await request(app.getHttpServer())
      .post('/categorias')
      .send({
        codigo: 'codigo',
        titulo: 'titulo',
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

    const cliente = await request(app.getHttpServer()).post('/clientes').send({
      nome: 'nome',
      nuit: '8934090224',
      cell1: '+258845738293',
      cell2: '+258835048201',
      email: 'teste@gmail.com',
    });

    await request(app.getHttpServer())
      .post('/pedidos')
      .send({
        id_cliente: cliente.body.id,
        id_instalacao: instalacao.body.id,
        codigo: '1644',
        desconto: 10,
        tipoPagamento: Tipo_Pagamento.CASH,
        itens: [
          {
            id_produto: produto.body.id,
            quantidade: 3,
            desconto: 10,
          },
        ],
      });

    const stock = await request(app.getHttpServer()).get(
      `/stock/artigo?id_instalacao=${instalacao.body.id}&id_artigo=${artigo.body.id}`,
    );
      expect(stock.body.actual).toBe('4');
  });
    
    it('pedidos/ (POST) => it should update the product stock', async () => {
      const instalacao = await request(app.getHttpServer())
        .post('/instalacoes')
        .send({
          codigo: 'codigo',
          titulo: 'titulo',
          cidade: 'Maputo',
          codigoPostal: '1114',
          endereco: 'Rua 1011',
          provincia: 'Maputo',
          tipo: Tipo_Instalacao.RESTAURANTE,
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

      const categoria = await request(app.getHttpServer())
        .post('/categorias')
        .send({
          codigo: 'codigo',
          titulo: 'titulo',
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

      const cliente = await request(app.getHttpServer())
        .post('/clientes')
        .send({
          nome: 'nome',
          nuit: '8934090224',
          cell1: '+258845738293',
          cell2: '+258835048201',
          email: 'teste@gmail.com',
        });

      await request(app.getHttpServer())
        .post('/pedidos')
        .send({
          id_cliente: cliente.body.id,
          id_instalacao: instalacao.body.id,
          codigo: '1644',
          desconto: 10,
          tipoPagamento: Tipo_Pagamento.CASH,
          itens: [
            {
              id_produto: produto.body.id,
              quantidade: 3,
              desconto: 10,
            },
          ],
        });

      const stock = await request(app.getHttpServer()).get(
        `/stock/artigo?id_instalacao=${instalacao.body.id}&id_artigo=${artigo.body.id}`,
      );
      expect(stock.body.actual).toBe('4');
    });


  it('pedidos/ (POST) => 400 if data not provided', async () => {
    await request(app.getHttpServer()).post('/pedidos').expect(400);
  });
});
