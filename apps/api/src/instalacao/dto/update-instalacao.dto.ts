import { PartialType } from '@nestjs/mapped-types';
import { CreateInstalacaoDto } from './create-instalacao.dto';

export class UpdateInstalacaoDto extends PartialType(CreateInstalacaoDto) {}
