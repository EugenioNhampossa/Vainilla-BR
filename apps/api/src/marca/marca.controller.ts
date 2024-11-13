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
import { CreateMarcaDto, FilterMarcaDto, UpdateMarcaDto } from './dto';
import { MarcaService } from './marca.service';

@Controller('marcas')
export class MarcaController {
  constructor(private readonly marcaService: MarcaService) {}

  @Post()
  create(@Body() createMarcaDto: CreateMarcaDto) {
    return this.marcaService.create(createMarcaDto);
  }

  @Get()
  findAll(@Query() filter: FilterMarcaDto) {
    return this.marcaService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marcaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMarcaDto: UpdateMarcaDto) {
    return this.marcaService.update(id, updateMarcaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marcaService.remove(id);
  }
}
