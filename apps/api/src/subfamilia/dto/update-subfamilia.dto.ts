import { PartialType } from '@nestjs/mapped-types';
import { CreateSubfamiliaDto } from './create-subfamilia.dto';

export class UpdateSubfamiliaDto extends PartialType(CreateSubfamiliaDto) {}
