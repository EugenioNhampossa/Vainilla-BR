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
import { SaidaStockService } from './saida-stock.service';
import { CreateSaidaStockDto } from './dto/create-saida-stock.dto';
import { UpdateSaidaStockDto } from './dto/update-saida-stock.dto';
import { FilterSaidaStockDto } from './dto/filter-saida-stock.dto';

@Controller('saidas-stock')
export class SaidaStockController {
  constructor(private readonly saidaStockService: SaidaStockService) {}

  @Post()
  create(@Body() createSaidaStockDto: CreateSaidaStockDto) {
    return this.saidaStockService.create(createSaidaStockDto);
  }

  @Get()
  findAll(@Query() filter: FilterSaidaStockDto) {
    return this.saidaStockService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.saidaStockService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSaidaStockDto: UpdateSaidaStockDto,
  ) {
    return this.saidaStockService.update(id, updateSaidaStockDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.saidaStockService.remove(id);
  }
}
