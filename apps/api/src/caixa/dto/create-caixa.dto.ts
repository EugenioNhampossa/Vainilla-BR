import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCaixaDto {
  @IsNotEmpty()
  @IsString()
  codigo: string;

  @IsNotEmpty()
  @IsString()
  email_usuario: string;
  
  @IsNotEmpty()
  @IsString()
  id_instalacao: string;

  @IsOptional()
  @IsBoolean()
  status: boolean;
}
