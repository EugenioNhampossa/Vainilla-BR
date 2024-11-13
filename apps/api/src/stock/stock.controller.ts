import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { FIlterStockDto, CreateStockDto, UpdateStockDto } from './dto';

//REVIEW:Rever as rotas de stock
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  create(@Body() createStockDto: CreateStockDto) {
    return this.stockService.create(createStockDto);
  }

  @Get('/artigo')
  findByArtigo(@Query() filter) {
    return this.stockService.findByArtigo(
      filter.id_instalacao,
      filter.id_artigo,
    );
  }

  @Get()
  findAll(@Query() filter: FIlterStockDto) {
    return this.stockService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStockDto: UpdateStockDto) {
    return this.stockService.update(id, updateStockDto);
  }
}
