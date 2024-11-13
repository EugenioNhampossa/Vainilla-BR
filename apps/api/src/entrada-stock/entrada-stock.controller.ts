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
import { EntradaStockService } from './entrada-stock.service';
import { CreateEntradaStockDto } from './dto/create-entrada-stock.dto';
import { UpdateEntradaStockDto } from './dto/update-entrada-stock.dto';
import { FilterEntradaStockDto } from './dto/filter-entrada-stock.dto';

@Controller('entradas-stock')
export class EntradaStockController {
  constructor(private readonly entradaStockService: EntradaStockService) {}

  @Post()
  create(@Body() createEntradaStockDto: CreateEntradaStockDto) {
    return this.entradaStockService.create(createEntradaStockDto);
  }

  @Get()
  findAll(@Query() filter: FilterEntradaStockDto) {
    return this.entradaStockService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entradaStockService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEntradaStockDto: UpdateEntradaStockDto,
  ) {
    return this.entradaStockService.update(+id, updateEntradaStockDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entradaStockService.remove(+id);
  }
}
