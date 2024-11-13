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
import { ArtigoService } from './artigo.service';
import { CreateArtigoDto, FilterArtigoDto, UpdateArtigoDto } from './dto';

@Controller('artigos')
export class ArtigoController {
  constructor(private readonly artigoService: ArtigoService) {}

  @Post()
  create(@Body() createArtigoDto: CreateArtigoDto) {
    return this.artigoService.create(createArtigoDto);
  }

  @Get('todos')
  getAllItems() {
    return this.artigoService.getAllItems();
  }

  @Get()
  findAll(@Query() filter: FilterArtigoDto) {
    return this.artigoService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artigoService.findOne(id);
  }

  @Get('/barcode/:codBarras')
  findBarCode(@Param('codBarras') codBarras: string) {
    return this.artigoService.findBarCode(codBarras);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArtigoDto: UpdateArtigoDto) {
    return this.artigoService.update(id, updateArtigoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.artigoService.remove(id);
  }
}
