import { IsDateString, IsOptional, IsString } from 'class-validator';
import { PaginateOptions } from 'src/shared/dto';

export class FilterContagemDto extends PaginateOptions {
  @IsDateString()
  @IsOptional()
  data?: Date;

  @IsString()
  @IsOptional()
  id_instalacao?: string;
}
