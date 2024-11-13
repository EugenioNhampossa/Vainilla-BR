import { Module } from '@nestjs/common';
import { SubfamiliaService } from './subfamilia.service';
import { SubfamiliaController } from './subfamilia.controller';

@Module({
  controllers: [SubfamiliaController],
  providers: [SubfamiliaService],
})
export class SubfamiliaModule {}
