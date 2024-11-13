import { PartialType } from '@nestjs/mapped-types';
import { CreateProdutoDto, itens } from './create-produto.dto';
import { IsArray, IsNotEmpty } from 'class-validator';

export class UpdateProdutoDto extends PartialType(CreateProdutoDto) {
  @IsArray()
  @IsNotEmpty()
  itens: itens[];
}
