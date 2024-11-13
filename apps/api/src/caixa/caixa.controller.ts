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
import { CaixaService } from './caixa.service';
import { CreateCaixaDto, FilterCaixaDto, UpdateCaixaDto } from './dto';
import { OpenSessionDto } from './dto/open-session.dto';
import { CloseSessionDto } from './dto/close-session.dto';

@Controller('caixas')
export class CaixaController {
  constructor(private readonly caixaService: CaixaService) {}

  @Post('/entrada')
  createEntryValue(@Body() dto: { id_caixa: string; valor: number }) {
    return this.caixaService.createEntryValue(dto);
  }
  @Post('/saida')
  createOutValue(@Body() dto: { id_caixa: string; valor: number }) {
    return this.caixaService.createOutValue(dto);
  }

  @Post()
  create(@Body() createCaixaDto: CreateCaixaDto) {
    return this.caixaService.create(createCaixaDto);
  }

  @Post('sessao/abrir')
  openSession(@Body() openSessionDto: OpenSessionDto) {
    return this.caixaService.openSession(openSessionDto);
  }

  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.caixaService.findOne(email);
  }

  @Get()
  findAll(@Query() filter: FilterCaixaDto) {
    return this.caixaService.findAll(filter);
  }

  @Patch('sessao/fechar/:id')
  closeSession(@Param('id') id: string, @Body() dto: CloseSessionDto) {
    return this.caixaService.closeSession(id, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCaixaDto: UpdateCaixaDto) {
    return this.caixaService.update(id, updateCaixaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.caixaService.remove(id);
  }
}
