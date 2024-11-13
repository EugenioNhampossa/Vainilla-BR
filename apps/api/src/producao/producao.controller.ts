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
import { ProducaoService } from './producao.service';
import { CreateProducaoDto } from './dto/create-producao.dto';
import { UpdateProducaoDto } from './dto/update-producao.dto';
import { FilterProducaoDto } from './dto/filter-producao.dto';

@Controller('producao')
export class ProducaoController {
  constructor(private readonly producaoService: ProducaoService) {}

  @Post()
  create(@Body() createProducaoDto: CreateProducaoDto) {
    return this.producaoService.create(createProducaoDto);
  }

  @Get()
  findAll(@Query() filter: FilterProducaoDto) {
    return this.producaoService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.producaoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProducaoDto: UpdateProducaoDto,
  ) {
    return this.producaoService.update(id, updateProducaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.producaoService.remove(id);
  }
}
