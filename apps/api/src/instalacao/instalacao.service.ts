import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { Instalacao, Prisma } from '@prisma/client';
import { PaginatedResult } from 'prisma-pagination';
import { PrismaService } from '../prisma/prisma.service';
import { paginante } from '../utils';
import {
  CreateInstalacaoDto,
  FilterInstalacaoDto,
  UpdateInstalacaoDto,
} from './dto';
import { ulid } from 'ulid';

@Injectable()
export class InstalacaoService {
  constructor(private prisma: PrismaService) {}

  async create(createInstalacaoDto: CreateInstalacaoDto) {
    const instalacao = await this.prisma.instalacao
      .create({
        data: {
          id: ulid(),
          codigo: createInstalacaoDto.codigo,
          tipo: createInstalacaoDto.tipo,
          titulo: createInstalacaoDto.titulo,
          descricao: createInstalacaoDto.descricao,
          Localizacao: {
            create: {
              id: ulid(),
              cidade: createInstalacaoDto.cidade,
              codigoPostal: createInstalacaoDto.codigoPostal,
              endereco: createInstalacaoDto.endereco,
              provincia: createInstalacaoDto.provincia,
            },
          },
        },
        select: {
          id: true,
        },
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            'A localização e código da instalação devem ser únicos',
          );
        }
        throw new InternalServerErrorException('Ops! Erro no servidor');
      });
    return instalacao;
  }

  async findAll(
    filter: FilterInstalacaoDto,
  ): Promise<PaginatedResult<Instalacao>> {
    const listInstalacao = await paginante<
      Instalacao,
      Prisma.InstalacaoFindManyArgs
    >(
      this.prisma.instalacao,
      {
        where: {
          codigo: {
            contains: filter.codigo,
          },
          titulo: {
            contains: filter.titulo,
          },
          tipo: filter.tipo,
        },
        include: {
          Localizacao: {
            select: {
              endereco: true,
              provincia: true,
              cidade: true,
              codigoPostal: true,
            },
          },
        },
      },
      { page: filter.page, perPage: filter.perPage },
    );
    return listInstalacao;
  }

  async findOne(id: string): Promise<Instalacao> {
    const instalacao = await this.prisma.instalacao
      .findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          Localizacao: true,
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException('A instalação não existe');
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });
    return instalacao;
  }

  async update(id: string, updateInstalacaoDto: UpdateInstalacaoDto) {
    await this.prisma.instalacao
      .update({
        where: {
          id,
        },
        data: {
          codigo: updateInstalacaoDto.codigo,
          tipo: updateInstalacaoDto.tipo,
          titulo: updateInstalacaoDto.titulo,
          descricao: updateInstalacaoDto.descricao,
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException('A instalação não existe');
        }
        if (error.code === 'P2002') {
          throw new BadRequestException(
            'A localização e código da instalação devem ser únicos',
          );
        }
        throw new InternalServerErrorException('Ops! Erro no servidor');
      });
  }

  //REVIEW:Verificar as referências da instalação antes de apagar.
  async remove(id: string): Promise<void> {
    throw new NotImplementedException(id);
  }
}
