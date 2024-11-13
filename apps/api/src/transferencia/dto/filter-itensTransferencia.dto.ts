import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginateOptions } from '../../shared/dto';

export class FilterItensTranferencia extends PaginateOptions {
  @IsString()
  @IsOptional()
  id_artigo: string;

  @IsString()
  @IsOptional()
  vFirst: string;

  @IsString()
  @IsOptional()
  vSecond: string;

  @IsString()
  @IsOptional()
  @IsIn(['gte', 'lte', 'equals', 'between'])
  condition: string;
}
