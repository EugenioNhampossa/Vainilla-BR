import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { MarcaModule } from './marca/marca.module';
import { ClienteModule } from './cliente/cliente.module';
import { FornecedorModule } from './fornecedor/fornecedor.module';
import { FamiliaModule } from './familia/familia.module';
import { SubfamiliaModule } from './subfamilia/subfamilia.module';
import { InstalacaoModule } from './instalacao/instalacao.module';
import { StockModule } from './stock/stock.module';
import { ArtigoModule } from './artigo/artigo.module';
import { TransferenciaModule } from './transferencia/transferencia.module';
import { CompraModule } from './compra/compra.module';
import { CaixaModule } from './caixa/caixa.module';
import { PedidoModule } from './pedido/pedido.module';
import { ProdutoModule } from './produto/produto.module';
import { CategoriaModule } from './categoria/categoria.module';
import { MesaModule } from './mesa/mesa.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { LoggerModule } from 'nestjs-pino';
import { ProducaoModule } from './producao/producao.module';
import { ContagemModule } from './contagem/contagem.module';
import { SaidaStockModule } from './saida-stock/saida-stock.module';
import { EntradaStockModule } from './entrada-stock/entrada-stock.module';
import { VariacaoStockModule } from './variacao-stock/variacao-stock.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    LoggerModule.forRoot(),
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'web', 'dist'),
      exclude: ['/api/(.*)'],
    }),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: 'nitonhamposse@gmail.com',
          pass: 'sevdillhnnnfdjlj',
        },
      },
      defaults: {
        from: 'nitonhamposse@gmail.com',
      },
    }),
    MarcaModule,
    ClienteModule,
    FornecedorModule,
    FamiliaModule,
    SubfamiliaModule,
    InstalacaoModule,
    StockModule,
    ArtigoModule,
    TransferenciaModule,
    CompraModule,
    CaixaModule,
    PedidoModule,
    ProdutoModule,
    CategoriaModule,
    MesaModule,
    UserModule,
    ProducaoModule,
    ContagemModule,
    SaidaStockModule,
    EntradaStockModule,
    VariacaoStockModule,
  ],
})
export class AppModule {}
