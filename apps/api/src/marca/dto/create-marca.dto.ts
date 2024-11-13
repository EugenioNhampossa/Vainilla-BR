import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMarcaDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsOptional()
  descricao?: string;
}
