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
import {
  CreateFornecedorDto,
  FilterFornecedorDto,
  UpdateFornecedorDto,
} from './dto';
import { FornecedorService } from './fornecedor.service';

@Controller('fornecedores')
export class FornecedorController {
  constructor(private readonly fornecedorService: FornecedorService) {}

  @Post()
  create(@Body() createFornecedorDto: CreateFornecedorDto) {
    return this.fornecedorService.create(createFornecedorDto);
  }

  @Get()
  findAll(@Query() filter: FilterFornecedorDto) {
    return this.fornecedorService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fornecedorService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFornecedorDto: UpdateFornecedorDto,
  ) {
    return this.fornecedorService.update(id, updateFornecedorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fornecedorService.remove(id);
  }
}
