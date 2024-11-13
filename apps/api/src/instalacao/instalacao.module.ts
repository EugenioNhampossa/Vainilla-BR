import { Module } from '@nestjs/common';
import { InstalacaoService } from './instalacao.service';
import { InstalacaoController } from './instalacao.controller';

@Module({
  controllers: [InstalacaoController],
  providers: [InstalacaoService],
})
export class InstalacaoModule {}
