import { IsOptional, IsString } from 'class-validator';

export class PaginateOptions {
  @IsString()
  @IsOptional()
  page?: string;

  @IsString()
  @IsOptional()
  perPage?: string;
}
