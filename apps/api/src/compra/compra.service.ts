import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Compra, ItemCompra, Prisma } from '@prisma/client';
import { PaginatedResult } from 'prisma-pagination';
import { PrismaService } from '../prisma/prisma.service';
import { buildNumberFilter, formatDate, paginante } from '../utils';
import {
  CreateCompraDto,
  FilterCompraDto,
  FilterItensCompraDto,
  UpdateCompraDto,
} from './dto';
import { ulid } from 'ulid';

@Injectable()
export class CompraService {
  constructor(private prisma: PrismaService) {}
  async create(createCompraDto: CreateCompraDto) {
    let compra: { id: string };
    await this.prisma
      .$transaction(
        async (tx) => {
          compra = await tx.compra.create({
            data: {
              id: ulid(),
              dataCompra: formatDate(),
              id_instalacao: createCompraDto.id_instalacao,
              id_fornecedor: createCompraDto.id_fornecedor,
            },
            select: {
              id: true,
            },
          });

          await Promise.all(
            createCompraDto.itens.map(async (item) => {
              if (item.quantidade > 0 && item.precoUnit > 0) {
                await tx.itemCompra.create({
                  data: {
                    id: ulid(),
                    dataCompra: formatDate(),
                    id_compra: compra.id,
                    quantidade: item.quantidade,
                    precoUnit: item.precoUnit,
                    id_artigo: item.id_artigo,
                  },
                });
                await tx.artigo.update({
                  where: {
                    id: item.id_artigo,
                  },
                  data: {
                    valorTotal: {
                      increment: item.quantidade * item.precoUnit,
                    },
                    qtyTotal: {
                      increment: item.quantidade,
                    },
                  },
                });

                await tx.stock.upsert({
                  where: {
                    id_instalacao_id_artigo: {
                      id_instalacao: createCompraDto.id_instalacao,
                      id_artigo: item.id_artigo,
                    },
                  },
                  update: {
                    actual: {
                      increment: item.quantidade,
                    },
                  },
                  create: {
                    id: ulid(),
                    id_instalacao: createCompraDto.id_instalacao,
                    id_artigo: item.id_artigo,
                    actual: item.quantidade,
                    economico: 20,
                    maximo: 20,
                    minimo: 20,
                    reposicao: 20,
                  },
                });
              }
            }),
          );
        },
        {
          maxWait: 5000,
          timeout: 60000,
        },
      )
      .catch((error) => {
        console.log(error);
        throw new InternalServerErrorException('Ops! Erro no servidor', error);
      });
    return compra;
  }

  async findItensCompra(
    filter: FilterItensCompraDto,
    id_compra: string,
  ): Promise<PaginatedResult<ItemCompra>> {
    const quantidade = {
      firstValue: filter?.vFirst,
      secondValue: filter?.vSecond,
      condition: filter?.condition,
    };
    const listItems = await paginante<
      ItemCompra,
      Prisma.ItemCompraFindManyArgs
    >(
      this.prisma,
      {
        where: {
          id_compra,
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

  async findAll(filter: FilterCompraDto): Promise<PaginatedResult<Compra>> {
    const listCompra = await paginante<Compra, Prisma.CompraFindManyArgs>(
      this.prisma.compra,
      {
        where: {
          dataCompra: formatDate(filter.data),
        },
        include: {
          Fornecedor: {
            select: {
              nome: true,
            },
          },
        },
      },
      { page: filter.page, perPage: filter.perPage },
    );

    return listCompra;
  }

  async findOne(id: string): Promise<Compra> {
    const compra = await this.prisma.compra
      .findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          Fornecedor: {
            select: {
              nome: true,
            },
          },
          ItemCompra: {
            include: {
              Artigo: {
                select: {
                  codigo: true,
                  titulo: true,
                },
              },
            },
          },
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException('A compra não existe');
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });
    return compra;
  }

  async update(id: string, updateCompraDto: UpdateCompraDto): Promise<Compra> {
    const compra = await this.prisma.compra
      .update({
        where: {
          id,
        },
        data: {
          ...updateCompraDto,
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException('A compra não existe');
        }
        if (error.code === 'P2003') {
          throw new BadRequestException('O fornecedor não foi cadastrado');
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });
    return compra;
  }

  async remove(id: string): Promise<void> {
    await this.prisma.compra.delete({
      where: {
        id,
      },
    });
  }
}
