import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ItemTransferencia, Prisma, TransfereciaStock } from '@prisma/client';
import { PaginatedResult } from 'prisma-pagination';
import { PrismaService } from '../prisma/prisma.service';
import {
  buildDateFilter,
  buildNumberFilter,
  formatDate,
  paginante,
} from '../utils';
import {
  CreateTransferenciaDto,
  FilterItensTranferencia,
  FilterTransferencia,
  UpdateTransferenciaDto,
} from './dto';
import { ulid } from 'ulid';

@Injectable()
export class TransferenciaService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTransferenciaDto) {
    if (dto.id_estDestino === dto.id_estPartida) {
      throw new BadRequestException(
        'A instalação de partida e destino devem ser diferentes',
      );
    }

    await this.prisma
      .$transaction(async (tx) => {
        const transferencia = await tx.transfereciaStock.create({
          data: {
            id: ulid(),
            dataTrans: formatDate(),
            id_estDestino: dto.id_estDestino,
            id_estPartida: dto.id_estPartida,
          },
          select: {
            id: true,
          },
        });

        await Promise.all(
          dto.itens.map(async (item) => {
            await tx.itemTransferencia.create({
              data: {
                id: ulid(),
                dataTrans: formatDate(),
                id_transferecia: transferencia.id,
                id_artigo: item.id_artigo,
                quantidade: item.quantidade,
              },
            });

            const stock = await tx.stock.findUnique({
              where: {
                id_instalacao_id_artigo: {
                  id_artigo: item.id_artigo,
                  id_instalacao: dto.id_estPartida,
                },
              },
              select: {
                actual: true,
                Artigo: {
                  select: {
                    titulo: true,
                  },
                },
              },
            });

            if (stock.actual < item.quantidade) {
              throw new BadRequestException(
                `Não há suficiente stock do artigo ${stock.Artigo.titulo} na instalação de origem para transferir a quantidade desejada.`,
              );
            }
            await tx.stock.update({
              where: {
                id_instalacao_id_artigo: {
                  id_artigo: item.id_artigo,
                  id_instalacao: dto.id_estPartida,
                },
              },
              data: {
                actual: {
                  decrement: item.quantidade,
                },
              },
            });

            await tx.stock.upsert({
              where: {
                id_instalacao_id_artigo: {
                  id_artigo: item.id_artigo,
                  id_instalacao: dto.id_estDestino,
                },
              },
              update: {
                actual: {
                  increment: item.quantidade,
                },
              },
              create: {
                id: ulid(),
                id_artigo: item.id_artigo,
                id_instalacao: dto.id_estDestino,
                actual: item.quantidade,
                economico: 20,
                maximo: 20,
                minimo: 20,
                reposicao: 20,
              },
            });
          }),
        );
      })
      .catch((error) => {
        throw new InternalServerErrorException('Ops! Erro no servidor');
      });
  }

  async findItensTransferencia(
    filter: FilterItensTranferencia,
    id_transferecia: string,
  ): Promise<PaginatedResult<ItemTransferencia>> {
    const quantidade = {
      firstValue: filter?.vFirst,
      secondValue: filter?.vSecond,
      condition: filter?.condition,
    };
    const listItems = await paginante<
      ItemTransferencia,
      Prisma.ItemTransferenciaFindManyArgs
    >(
      this.prisma,
      {
        where: {
          id_transferecia,
          id_artigo: filter.id_artigo,
          quantidade: buildNumberFilter(quantidade),
        },
        include: {
          Artigo: {
            select: {
              codigo: true,
              titulo: true,
            },
          },
        },
      },
      { page: filter.page, perPage: filter.perPage },
    );
    return listItems;
  }

  async findAll(
    filter: FilterTransferencia,
  ): Promise<PaginatedResult<TransfereciaStock>> {
    const dataCriacao = {
      firstDate: filter?.firstDate,
      secondDate: filter?.secondDate,
      condition: filter?.condition,
    };

    const listTrans = await paginante<
      TransfereciaStock,
      Prisma.TransfereciaStockFindManyArgs
    >(
      this.prisma.transfereciaStock,
      {
        where: {
          id_estDestino: filter.id_estDestino,
          id_estPartida: filter.id_estPartida,
          dataCriacao: buildDateFilter(dataCriacao),
        },
        orderBy: {
          dataCriacao: 'desc',
        },
        include: {
          Destino: {
            select: {
              titulo: true,
              tipo: true,
            },
          },
          Partida: {
            select: {
              titulo: true,
              tipo: true,
            },
          },
        },
      },
      { page: filter.page, perPage: filter.perPage },
    );
    return listTrans;
  }

  async findOne(id: string): Promise<TransfereciaStock> {
    const transfereciaStock =
      await this.prisma.transfereciaStock.findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          Destino: {
            select: {
              titulo: true,
            },
          },
          Partida: {
            select: {
              titulo: true,
            },
          },
          Item: {
            select: {
              quantidade: true,
              Artigo: {
                select: {
                  codigo: true,
                  codigoBarras: true,
                  titulo: true,
                  unidade: true,
                },
              },
            },
          },
        },
      });
    return transfereciaStock;
  }

  async update(id: string, updateTransferenciaDto: UpdateTransferenciaDto) {
    updateTransferenciaDto;
    return `This action updates a #${id} transferencia`;
  }

  async remove(id: string) {
    return `This action removes a #${id} transferencia`;
  }
}
