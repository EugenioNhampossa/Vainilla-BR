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
import { SubfamiliaService } from './subfamilia.service';
import { CreateSubfamiliaDto } from './dto/create-subfamilia.dto';
import { UpdateSubfamiliaDto } from './dto/update-subfamilia.dto';
import { FilterSubfamilia } from './dto';

@Controller('subfamilias')
export class SubfamiliaController {
  constructor(private readonly subfamiliaService: SubfamiliaService) {}

  @Post()
  create(@Body() createSubfamiliaDto: CreateSubfamiliaDto) {
    return this.subfamiliaService.create(createSubfamiliaDto);
  }

  @Get('familia/:id_familia')
  findByFamilia(
    @Param('id_familia') id_familia: string,
    @Query() filter: FilterSubfamilia,
  ) {
    return this.subfamiliaService.findByFamilia(id_familia, filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subfamiliaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubfamiliaDto: UpdateSubfamiliaDto,
  ) {
    return this.subfamiliaService.update(id, updateSubfamiliaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subfamiliaService.remove(id);
  }
}
