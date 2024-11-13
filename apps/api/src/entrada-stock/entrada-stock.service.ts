import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateEntradaStockDto } from './dto/create-entrada-stock.dto';
import { UpdateEntradaStockDto } from './dto/update-entrada-stock.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ulid } from 'ulid';
import { formatDate, paginante } from 'src/utils';
import { FilterEntradaStockDto } from './dto/filter-entrada-stock.dto';
import { EntradaStock, Prisma } from '@prisma/client';

@Injectable()
export class EntradaStockService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEntradaStockDto) {
    await this.prisma
      .$transaction(async (tx) => {
        await Promise.all(
          dto.itens.map(async (item) => {
            await tx.entradaStock.create({
              data: {
                id: ulid(),
                dataEntrada: formatDate(),
                id_artigo: item.id_artigo,
                id_instalacao: dto.id_instalacao,
                quantidade: item.quantidade,
              },
            });
            await tx.stock.update({
              where: {
                id_instalacao_id_artigo: {
                  id_artigo: item.id_artigo,
                  id_instalacao: dto.id_instalacao,
                },
              },
              data: {
                actual: {
                  increment: +item.quantidade,
                },
              },
            });
          }),
        );
      })
      .catch((error) => {
        throw new InternalServerErrorException('Ops! Erro no serividor');
      });
  }

  async findAll(filter: FilterEntradaStockDto) {
    const entradas = await paginante<
      EntradaStock,
      Prisma.EntradaStockFindManyArgs
    >(
      this.prisma.entradaStock,
      {
        where: {
          id_instalacao: filter.id_instalacao,
          dataEntrada: {
            gte: formatDate(filter.dataInicio),
            lte: formatDate(filter.dataFim),
          },
        },
        select: {
          dataCriacao: true,
          quantidade: true,
          Artigo: {
            select: {
              codigo: true,
              titulo: true,
              unidade: true,
            },
          },
          Instalacao: {
            select: {
              titulo: true,
            },
          },
        },
      },
      {
        page: filter.page,
        perPage: filter.perPage,
      },
    ).catch((error) => {
      throw new InternalServerErrorException('Ops! Erro no serividor');
    });

    return entradas;
  }

  findOne(id: number) {
    return `This action returns a #${id} entradaStock`;
  }

  update(id: number, updateEntradaStockDto: UpdateEntradaStockDto) {
    return `This action updates a #${id} entradaStock`;
  }

  remove(id: number) {
    return `This action removes a #${id} entradaStock`;
  }
}
