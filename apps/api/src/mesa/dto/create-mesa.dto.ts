import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMesaDto {
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsString()
  @IsNotEmpty()
  id_instalacao: string;
}
