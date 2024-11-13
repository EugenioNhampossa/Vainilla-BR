import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CompraService } from './compra.service';
import {
  CreateCompraDto,
  FilterCompraDto,
  FilterItensCompraDto,
  UpdateCompraDto,
} from './dto';

@Controller('compras')
export class CompraController {
  constructor(private readonly compraService: CompraService) {}

  @Post()
  create(@Body() createCompraDto: CreateCompraDto) {
    return this.compraService.create(createCompraDto);
  }

  @Get()
  findAll(@Query() filter: FilterCompraDto) {
    return this.compraService.findAll(filter);
  }

  @Get(':id_compra/itens')
  findItensCompra(
    @Query() filter: FilterItensCompraDto,
    @Param('id_compra') id_compra: string,
  ) {
    return this.compraService.findItensCompra(filter, id_compra);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.compraService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompraDto: UpdateCompraDto) {
    return this.compraService.update(id, updateCompraDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.compraService.remove(id);
  }
}
