import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { itemStock } from '../../shared/@types';

export class CreateTransferenciaDto {
  @IsNotEmpty()
  @IsString()
  id_estPartida: string;

  @IsNotEmpty()
  @IsString()
  id_estDestino: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  itens: itemStock[];
}
