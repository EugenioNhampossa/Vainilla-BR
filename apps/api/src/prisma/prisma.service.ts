import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  cleanDB() {
    return this.$transaction([
      this.stock.deleteMany(),
      this.caixa.deleteMany(),
      this.compra.deleteMany(),
      this.pedido.deleteMany(),
      this.instalacao.deleteMany(),
      this.cliente.deleteMany(),
      this.mesa.deleteMany(),
      this.combo.deleteMany(),
      this.produto.deleteMany(),
      this.stock.deleteMany(),
      this.artigo.deleteMany(),
      this.subFamilia.deleteMany(),
      this.familia.deleteMany(),
      this.categoria.deleteMany(),
      this.fornecedor.deleteMany(),
      this.marca.deleteMany(),
    ]);
  }
}
