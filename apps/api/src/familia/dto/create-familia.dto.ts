import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFamiliaDto {
  @IsNotEmpty()
  @IsString()
  codigo: string;

  @IsNotEmpty()
  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  descricao?: string;
}
