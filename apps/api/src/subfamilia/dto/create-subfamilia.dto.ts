import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSubfamiliaDto {
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsString()
  @IsNotEmpty()
  id_familia: string;

  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsOptional()
  descricao?: string;
}
