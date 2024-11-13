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
import { InstalacaoService } from './instalacao.service';
import {
  CreateInstalacaoDto,
  FilterInstalacaoDto,
  UpdateInstalacaoDto,
} from './dto';

@Controller('instalacoes')
export class InstalacaoController {
  constructor(private readonly instalacaoService: InstalacaoService) {}

  @Post()
  create(@Body() createInstalacaoDto: CreateInstalacaoDto) {
    return this.instalacaoService.create(createInstalacaoDto);
  }

  @Get()
  findAll(@Query() filter: FilterInstalacaoDto) {
    return this.instalacaoService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.instalacaoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInstalacaoDto: UpdateInstalacaoDto,
  ) {
    return this.instalacaoService.update(id, updateInstalacaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.instalacaoService.remove(id);
  }
}
