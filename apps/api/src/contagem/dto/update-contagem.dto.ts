import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateContagemDto } from './create-contagem.dto';

export class UpdateContagemDto extends PartialType(CreateContagemDto) {}
