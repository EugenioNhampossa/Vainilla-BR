import { Module } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { CaixaModule } from '../caixa/caixa.module';

@Module({
  controllers: [PedidoController],
  providers: [PedidoService],
  imports: [CaixaModule],
})
export class PedidoModule {}
