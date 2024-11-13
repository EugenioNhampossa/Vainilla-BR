import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateEntradaStockDto {
  @IsString()
  @IsNotEmpty()
  id_instalacao: string;

  @IsArray()
  @IsNotEmpty()
  itens: {
    id_artigo: string;
    quantidade: number;
  }[];
}
