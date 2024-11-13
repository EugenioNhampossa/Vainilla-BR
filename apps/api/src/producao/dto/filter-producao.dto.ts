import { IsOptional, IsString } from 'class-validator';
import { PaginateOptions } from 'src/shared/dto';

export class FilterProducaoDto extends PaginateOptions {
  @IsString()
  @IsOptional()
  titulo?: string;

  @IsString()
  @IsOptional()
  codigo?: string;
}
