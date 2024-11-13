import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';
import { ulid } from 'ulid';
import { paginante } from 'src/utils';
import { Prisma, Stock_Producao } from '@prisma/client';
import { CreateProducaoDto } from './dto/create-producao.dto';
import { FilterProducaoDto } from './dto/filter-producao.dto';
import { UpdateProducaoDto } from './dto/update-producao.dto';

@Injectable()
export class ProducaoService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProducaoDto) {
    await this.prisma
      .$transaction(async (tx) => {
        const producao = await tx.producao.create({
          data: {
            id: ulid(),
            id_instalacao: dto.id_instalacao,
          },
          select: {
            id: true,
            id_instalacao: true,
          },
        });

        await Promise.all(
          dto.itens.map(async (item) => {
            await tx.item_Producao.create({
              data: {
                id: ulid(),
                id_producao: producao.id,
                quantidade: item.quantidade,
                id_produto: item.id_produto,
              },
              select: {
                id: true,
              },
            });

            await tx.stock_Producao.upsert({
              where: {
                id_instalacao_id_produto: {
                  id_instalacao: producao.id_instalacao,
                  id_produto: item.id_produto,
                },
              },
              create: {
                id: ulid(),
                id_instalacao: producao.id_instalacao,
                id_produto: item.id_produto,
                actual: +item.quantidade,
              },
              update: {
                actual: {
                  increment: +item.quantidade,
                },
              },
            });

            const prod_itens = await tx.produto_Item.findMany({
              where: {
                id_produto: item.id_produto,
              },
              select: {
                id_artigo: true,
                quantidade: true,
              },
            });

            if (prod_itens.length > 0) {
              await this.updateStockSimples(
                producao.id_instalacao,
                prod_itens,
                item.quantidade,
              );
            } else {
              await this.updateStockComposto(
                item.id_produto,
                producao.id_instalacao,
                item.quantidade,
              );
            }
          }),
        );
      })
      .catch((error) => {
        throw new InternalServerErrorException('Ops! Erro no servidor', error);
      });
  }

  async updateStockSimples(
    id_instalacao: string,
    ingredientes: {
      id_artigo: string;
      quantidade: Decimal;
    }[],
    nrProdutos: Decimal,
  ) {
    await Promise.all(
      ingredientes.map(async (ingrediente) => {
        await this.prisma.stock.update({
          where: {
            id_instalacao_id_artigo: {
              id_instalacao: id_instalacao,
              id_artigo: ingrediente.id_artigo,
            },
          },
          data: {
            actual: {
              decrement: +ingrediente.quantidade * +nrProdutos,
            },
          },
        });
      }),
    );
  }
  async updateStockComposto(
    id_produto: string,
    id_instalacao: string,
    nrProdutos: Decimal,
  ) {
    const produtos = await this.prisma.combo.findMany({
      where: {
        id_produto,
      },
    });

    await Promise.all(
      produtos.map(async (produto) => {
        const prod_itens = await this.prisma.produto_Item.findMany({
          where: {
            id_produto: produto.id,
          },
          select: {
            id_artigo: true,
            quantidade: true,
          },
        });
        await this.updateStockSimples(id_instalacao, prod_itens, nrProdutos);
      }),
    );
  }

  async findAll(dto: FilterProducaoDto) {
    const producao = paginante<
      Stock_Producao,
      Prisma.Stock_ProducaoFindManyArgs
    >(
      this.prisma.stock_Producao,
      {
        where: {
          Produto: {
            titulo: {
              contains: dto.titulo,
              mode: 'insensitive',
            },
            codigo: dto.codigo,
          },
        },
        select: {
          id: true,
          actual: true,
          dataActualizacao: true,
          Produto: {
            select: {
              titulo: true,
              codigo: true,
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
        page: dto.page,
        perPage: dto.perPage,
      },
    ).catch(() => {
      throw new InternalServerErrorException('Ops! erro no servidor.');
    });
    return producao;
  }

  async findOne(id: string) {
    return id;
  }

  async update(id: string, updatePedidoDto: UpdateProducaoDto) {
    updatePedidoDto;
    return `This action updates a #${id} pedido`;
  }

  async remove(id: string) {
    return `This action removes a #${id} pedido`;
  }
}
