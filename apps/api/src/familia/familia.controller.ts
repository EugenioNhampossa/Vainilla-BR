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
import { CreateFamiliaDto, FilterFamiliaDto, UpdateFamiliaDto } from './dto';
import { FamiliaService } from './familia.service';

@Controller('familias')
export class FamiliaController {
  constructor(private readonly familiaService: FamiliaService) {}

  @Post()
  create(@Body() createFamiliaDto: CreateFamiliaDto) {
    return this.familiaService.create(createFamiliaDto);
  }

  @Get()
  findAll(@Query() filter: FilterFamiliaDto) {
    return this.familiaService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.familiaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFamiliaDto: UpdateFamiliaDto) {
    return this.familiaService.update(id, updateFamiliaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.familiaService.remove(id);
  }
}
