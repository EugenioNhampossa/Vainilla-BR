import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateFornecedorDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  nuit: string;

  @IsOptional()
  @IsPhoneNumber('MZ')
  cell1: string;

  @IsOptional()
  @IsPhoneNumber('MZ')
  cell2?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
