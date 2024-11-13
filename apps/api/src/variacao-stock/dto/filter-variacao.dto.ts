import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class FilterVariacaoDto {
  @IsDateString()
  @IsOptional()
  dataInicio?: Date;

  @IsDateString()
  @IsOptional()
  dataFim?: Date;

  @IsString()
  @IsNotEmpty()
  id_instalacao: string;
}
