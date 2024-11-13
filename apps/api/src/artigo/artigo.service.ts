import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Artigo, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { paginante } from '../utils';
import { CreateArtigoDto, FilterArtigoDto, UpdateArtigoDto } from './dto';
import { ulid } from 'ulid';
import { PinoLogger } from 'nestjs-pino';
@Injectable()
export class ArtigoService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ArtigoService.name);
  }

  async create(createArtigoDto: CreateArtigoDto) {
    let artigo: { id: string };
    await this.prisma
      .$transaction(async (tx) => {
        artigo = await tx.artigo.create({
          data: {
            id: ulid(),
            ...createArtigoDto,
          },
          select: {
            id: true,
          },
        });

        const instalacoes = await tx.instalacao.findMany();

        await Promise.all(
          instalacoes.map(async (instalacao) => {
            await tx.stock.create({
              data: {
                id: ulid(),
                id_instalacao: instalacao.id,
                id_artigo: artigo.id,
                minimo: 0,
                maximo: 0,
                reposicao: 0,
                economico: 0,
              },
            });
          }),
        );
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          throw new BadRequestException('O código do artigo já foi cadastrado');
        }
        if (error.code === 'P2003') {
          throw new NotFoundException('Marca ou subfamilia inexistente');
        }
        throw new InternalServerErrorException('Ops! Erro no servidor.', error);
      });
    return artigo;
  }

  async findAll(filter: FilterArtigoDto) {
    const artigoList = await paginante<Artigo, Prisma.ArtigoFindManyArgs>(
      this.prisma.artigo,
      {
        where: {
          codigo: {
            contains: filter.codigo,
          },
          titulo: {
            contains: filter.titulo,
          },
          SubFamilia: filter?.id_familia?.length
            ? { id_familia: filter?.id_familia }
            : {},
          id_marca: filter?.id_marca,
          id_subfamilia: filter?.id_subfamilia,
        },
        include: {
          SubFamilia: {
            select: {
              titulo: true,
            },
          },
          Marca: {
            select: {
              titulo: true,
            },
          },
        },
      },

      { page: filter.page, perPage: filter.perPage },
    );
    return artigoList;
  }

  async getAllItems() {
    const artigos = await this.prisma.artigo
      .findMany({
        select: {
          id: true,
          codigo: true,
          titulo: true,
          unidade: true,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException('Ops! Erro no servidor.', error);
      });
    return artigos;
  }

  async findBarCode(codigoBarras: string) {
    const artigo = this.prisma.artigo
      .findUniqueOrThrow({
        where: {
          codigoBarras,
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException('O Artigo não existe');
        }
        throw new InternalServerErrorException('Ops! Erro no servidor.');
      });
    return artigo;
  }

  async findOne(id: string) {
    const artigo = await this.prisma.artigo
      .findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          Marca: {
            select: {
              titulo: true,
            },
          },
          SubFamilia: {
            select: {
              codigo: true,
              titulo: true,
              Familia: {
                select: {
                  id: true,
                  codigo: true,
                  titulo: true,
                },
              },
            },
          },
          Stock: true,
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException('O Artigo não existe');
        }
        throw new InternalServerErrorException('Ops!, Erro no servidor');
      });

    return artigo;
  }

  async update(id: string, updateArtigoDto: UpdateArtigoDto) {
    await this.prisma.artigo
      .update({
        where: {
          id,
        },
        data: {
          ...updateArtigoDto,
        },
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          throw new BadRequestException('O código do artigo já foi cadastrado');
        }
        if (error.code === 'P2003') {
          throw new NotFoundException('Marca, subfamilia inexistente');
        }
        if (error.code === 'P2025') {
          throw new NotFoundException('O Artigo não existe');
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.artigo
      .delete({
        where: {
          id,
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException('O Artigo não existe');
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });
  }
}
