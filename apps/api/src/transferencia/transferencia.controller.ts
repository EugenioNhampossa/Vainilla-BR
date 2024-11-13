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
  CreateTransferenciaDto,
  FilterItensTranferencia,
  FilterTransferencia,
  UpdateTransferenciaDto,
} from './dto';
import { TransferenciaService } from './transferencia.service';

@Controller('transferencias')
export class TransferenciaController {
  constructor(private readonly transferenciaService: TransferenciaService) {}

  @Post()
  create(@Body() createTransferenciaDto: CreateTransferenciaDto) {
    return this.transferenciaService.create(createTransferenciaDto);
  }

  @Get()
  findAll(@Query() filter: FilterTransferencia) {
    return this.transferenciaService.findAll(filter);
  }

  @Get(':id_tranferencia/itens')
  findItensTransferencia(
    @Query() filter: FilterItensTranferencia,
    @Param('id_tranferencia') id_transferencia: string,
  ) {
    return this.transferenciaService.findItensTransferencia(
      filter,
      id_transferencia,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transferenciaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransferenciaDto: UpdateTransferenciaDto,
  ) {
    return this.transferenciaService.update(id, updateTransferenciaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transferenciaService.remove(id);
  }
}
