import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { CreatePedidoDto, UpdatePedidoDto, FilterPedidoDto } from './dto';
import { AtGuard, RoleGuard } from '../common/guards';
import { Role } from '../common/enums';
import { Roles } from '../common/decorators/roles.decorator';
import { Estado_Pedido } from '@prisma/client';

@Controller('pedidos')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidoService.create(createPedidoDto);
  }

  @Get()
  findAll(@Query() filter: FilterPedidoDto) {
    return this.pedidoService.findAll(filter);
  }

  @Get('metrics')
  getMetrics(@Query() filter: FilterPedidoDto) {
    return this.pedidoService.getMetrics(filter);
  }

  @Get('vendas-por-produto')
  getNrVendasPorProduto(@Query() filter: FilterPedidoDto) {
    return this.pedidoService.getNrVendasPorProduto(filter);
  }
  @Get('total-por-sessao/:id')
  getTotalPorSessao(@Param('id') id: string) {
    return this.pedidoService.getPedidosPorSessao(id);
  }

  @Get('/open')
  getOpenOrders(@Query() filter: { estado?: Estado_Pedido; codigo?: string }) {
    return this.pedidoService.getOpenOrders(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pedidoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePedidoDto: UpdatePedidoDto) {
    return this.pedidoService.update(id, updatePedidoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pedidoService.remove(id);
  }
}
