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
import { ContagemService } from './contagem.service';
import { CreateContagemDto } from './dto/create-contagem.dto';
import { UpdateContagemDto } from './dto/update-contagem.dto';
import { FilterContagemDto } from './dto/filter-contagem.dto';

@Controller('contagens')
export class ContagemController {
  constructor(private readonly contagemService: ContagemService) {}

  @Post()
  create(@Body() createContagemDto: CreateContagemDto) {
    return this.contagemService.create(createContagemDto);
  }

  @Get()
  findAll(@Query() filter: FilterContagemDto) {
    return this.contagemService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contagemService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContagemDto: UpdateContagemDto,
  ) {
    return this.contagemService.update(id, updateContagemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contagemService.remove(id);
  }
}
