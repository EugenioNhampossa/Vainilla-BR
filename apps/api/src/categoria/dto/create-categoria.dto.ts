import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoriaDto {
  @IsNotEmpty()
  @IsString()
  codigo: string;

  @IsNotEmpty()
  @IsString()
  titulo: string;
}
