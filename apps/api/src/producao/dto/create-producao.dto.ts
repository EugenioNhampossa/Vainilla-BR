import { Decimal } from '@prisma/client/runtime/library';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

interface ItensProd {
  id_produto: string;
  quantidade: Decimal;
}

export class CreateProducaoDto {
  @IsString()
  @IsNotEmpty()
  id_instalacao: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  itens: ItensProd[];
}
