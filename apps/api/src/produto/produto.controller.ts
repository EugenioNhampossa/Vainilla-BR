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
import { ProdutoService } from './produto.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { FilterProdutoDto } from './dto/filter-produto.dto';

@Controller('produtos')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Post()
  createProduto(@Body() createProdutoDto: CreateProdutoDto) {
    return this.produtoService.createProduto(createProdutoDto);
  }

  @Post('combo')
  createCombo(@Body() createComboDto: CreateProdutoDto) {
    return this.produtoService.createCombo(createComboDto);
  }

  @Get()
  findAll(@Query() filter: FilterProdutoDto) {
    return this.produtoService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.produtoService.findOne(id);
  }

  @Patch('combo/:id')
  updateCombo(
    @Param('id') id: string,
    @Body() updateProdutoDto: UpdateProdutoDto,
  ) {
    return this.produtoService.updateCombo(id, updateProdutoDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProdutoDto: UpdateProdutoDto) {
    return this.produtoService.updateProduto(id, updateProdutoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.produtoService.remove(+id);
  }
}
