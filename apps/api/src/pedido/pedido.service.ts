import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePedidoDto, UpdatePedidoDto, FilterPedidoDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { ulid } from 'ulid';
import { formatDate, paginante } from 'src/utils';
import { Estado_Pedido, Pedido, Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
@Injectable()
export class PedidoService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePedidoDto) {
    await this.prisma
      .$transaction(
        async (tx) => {
          const pedido = await tx.pedido.create({
            data: {
              id: ulid(),
              id_sessao: dto.id_sessao,
              id_caixa: dto.id_caixa,
              dataPedido: formatDate(),
              codigo: dto.codigo,
              id_cliente: dto.id_cliente,
              desconto: dto.desconto,
            },
            select: {
              id: true,
              id_caixa: true,
            },
          });

          await Promise.all(
            dto.itens.map(async (produto) => {
              await tx.itemPedido.create({
                data: {
                  id: ulid(),
                  id_pedido: pedido.id,
                  dataPedido: formatDate(),
                  quantidade: produto.quantidade,
                  desconto: produto.desconto,
                  id_produto: produto.id_produto,
                  preco: produto.preco,
                  titulo: produto.titulo,
                },
                select: {
                  id: true,
                },
              });
            }),
          );
        },
        {
          timeout: 60000,
          maxWait: 5000,
        },
      )
      .catch((error) => {
        throw new InternalServerErrorException('Ops! Erro no servidor', error);
      });
  }

  async getOpenOrders(filter: { estado?: Estado_Pedido; codigo?: string }) {
    const pedidos = await this.prisma.pedido.findMany({
      where: {
        Pagamento: null,
        estado: filter.estado,
        codigo: filter.codigo,
      },
      select: {
        id: true,
        codigo: true,
        desconto: true,
        estado: true,
        bloqueado: true,
        ItemPedido: {
          select: {
            id: true,
            id_produto: true,
            dataCriacao: true,
            titulo: true,
            quantidade: true,
            preco: true,
            desconto: true,
            confirmado: true,
          },
        },
        Cliente: {
          select: {
            id: true,
            nome: true,
            nuit: true,
          },
        },
      },
    });

    if (pedidos.length) {
      const list = pedidos.map((pedido) => {
        return {
          ...pedido,
          desconto: pedido.desconto.toNumber(),
          ItemPedido: pedido.ItemPedido.map((produto) => {
            return {
              ...produto,
              desconto: produto.desconto.toNumber(),
              preco: produto.preco.toNumber(),
              quantidade: produto.quantidade.toNumber(),
            };
          }),
        };
      });
      return list;
    } else {
      return [];
    }
  }

  async getPedidosPorSessao(id_sessao: string) {
    try {
      const pedidos = await this.prisma.pedido.findMany({
        where: {
          id_sessao,
        },
        select: {
          Pagamento: {
            select: {
              tipoPagamento: true,
            },
          },
          ItemPedido: {
            select: {
              preco: true,
              quantidade: true,
            },
          },
        },
      });

      let total = 0;
      let totalPOS = 0;
      pedidos?.forEach((pedido) => {
        const tipo = pedido.Pagamento.tipoPagamento;
        pedido.ItemPedido.forEach((item) => {
          const valor = item.preco.toNumber() * item.quantidade.toNumber();
          if (tipo == 'CCREDITO' || tipo == 'CDEBITO') {
            totalPOS += valor;
          }
          total += valor;
        });
      });

      return { total, totalPOS };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Ops! erro no servidor.');
    }
  }

  async getMetrics(dto: FilterPedidoDto) {
    const pedidos = await this.prisma.pedido
      .findMany({
        where: {
          dataPedido: {
            gte: formatDate(dto.dataInicio),
            lte: formatDate(dto.dataFim),
          },
        },
        select: {
          desconto: true,
          ItemPedido: {
            select: {
              preco: true,
              desconto: true,
              quantidade: true,
            },
          },
        },
      })
      .catch(() => {
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });

    const nrPedidos = pedidos.length;
    if (nrPedidos) {
      let total = 0;
      pedidos.forEach(({ ItemPedido, desconto: descCarro }) => {
        ItemPedido.forEach(({ desconto, preco, quantidade }) => {
          const valor = preco.toNumber() * quantidade.toNumber();
          const valorTotal = valor - (valor * desconto.toNumber()) / 100;
          total += valorTotal - (valorTotal * descCarro.toNumber()) / 100;
        });
      });
      return { total, nrPedidos };
    }
    return { total: 0, nrPedidos: 0 };
  }

  async getNrVendasPorProduto(dto: FilterPedidoDto) {
    try {
      const pedidosPorProduto = await this.prisma.itemPedido.groupBy({
        by: ['id_produto'],
        _sum: {
          quantidade: true,
        },
        where: {
          Produto: {
            codigo: dto.codigo_produto,
          },
          dataPedido: {
            gte: formatDate(dto.dataInicio),
            lte: formatDate(dto.dataFim),
          },
        },
      });

      let totalGeral = 0;
      const pedidos = await Promise.all(
        pedidosPorProduto.map(async (pedido) => {
          const itens = await this.prisma.itemPedido.findMany({
            where: {
              id_produto: pedido.id_produto,
              dataPedido: {
                gte: formatDate(dto.dataInicio),
                lte: formatDate(dto.dataFim),
              },
            },
            select: {
              desconto: true,
              quantidade: true,
              Pedido: {
                select: {
                  desconto: true,
                },
              },
              Produto: {
                select: {
                  preco: true,
                  codigo: true,
                  titulo: true,
                },
              },
            },
          });

          let total = 0;
          let totalLiquido = 0;
          let totalDesconto = 0;

          itens.forEach((valores) => {
            const valor =
              valores.quantidade.toNumber() * valores.Produto.preco.toNumber();
            const desconto = (valor * valores.desconto.toNumber()) / 100;
            total += valor;
            totalDesconto += desconto;
            totalLiquido += valor - desconto;
          });

          totalGeral += totalLiquido;

          return {
            codigo: itens[0].Produto.codigo,
            titulo: itens[0].Produto.titulo,
            precoVenda: itens[0].Produto.preco.toNumber(),
            quantidade: pedido._sum.quantidade.toNumber(),
            total,
            totalDesconto,
            totalLiquido,
          };
        }),
      );
      return { pedidos, total: totalGeral };
    } catch (error) {
      throw new InternalServerErrorException('Ops! erro no servidor.');
    }
  }

  async findAll(dto: FilterPedidoDto) {
    const pedido = paginante<Pedido, Prisma.PedidoFindManyArgs>(
      this.prisma.pedido,
      {
        where: {
          codigo: dto.codigo,
          dataPedido: {
            gte: formatDate(dto.dataInicio),
            lte: formatDate(dto.dataFim),
          },
        },
        include: {
          Caixa: {
            select: {
              codigo: true,
              Instalacao: {
                select: {
                  titulo: true,
                },
              },
            },
          },
          Cliente: {
            select: {
              nome: true,
            },
          },
          Pagamento: {
            select: {
              tipoPagamento: true,
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
    return pedido;
  }

  async findOne(id: string) {
    const pedido = await this.prisma.pedido
      .findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          Cliente: {
            select: {
              nome: true,
            },
          },
          Caixa: {
            select: {
              codigo: true,
              Instalacao: {
                select: {
                  titulo: true,
                },
              },
            },
          },
          Pagamento: {
            select: {
              tipoPagamento: true,
            },
          },
          ItemPedido: {
            select: {
              desconto: true,
              quantidade: true,
              Produto: {
                select: {
                  titulo: true,
                  preco: true,
                },
              },
            },
          },
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException('O pedido não existe');
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });
    return pedido;
  }

  async update(id: string, dto: UpdatePedidoDto) {
    const data = new Date();
    data.setHours(0, 0, 0, 0);
    const isoString = data.toISOString();

    await this.prisma
      .$transaction(
        async (tx) => {
          const pedido = await tx.pedido.upsert({
            where: {
              id,
            },
            update: {
              id_caixa: dto.id_caixa,
              codigo: dto.codigo,
              id_cliente: dto.id_cliente,
              desconto: dto.desconto,
              estado: dto.estado,
              bloqueado: dto.bloqueado,
            },
            create: {
              id: ulid(),
              id_sessao: dto.id_sessao,
              dataPedido: isoString,
              id_caixa: dto.id_caixa,
              codigo: dto.codigo,
              id_cliente: dto.id_cliente,
              desconto: dto.desconto,
              estado: dto.estado,
              bloqueado: dto.bloqueado,
            },
            select: {
              id: true,
              id_caixa: true,
            },
          });

          if (dto.tipoPagamento) {
            await tx.pagamento.create({
              data: {
                id: ulid(),
                tipoPagamento: dto.tipoPagamento,
                id_pedido: pedido.id,
              },
            });
          }

          await Promise.all(
            dto.itens.map(async (produto) => {
              await tx.itemPedido.upsert({
                where: {
                  id: produto.id,
                  confirmado: true,
                },
                update: {},
                create: {
                  id: ulid(),
                  id_pedido: pedido.id,
                  dataPedido: formatDate(),
                  quantidade: produto.quantidade,
                  desconto: produto.desconto,
                  id_produto: produto.id_produto,
                  preco: produto.preco,
                  titulo: produto.titulo,
                },
                select: {
                  id: true,
                },
              });
              if (dto.estado == 'COMPLETO') {
                await tx.stock_Producao.upsert({
                  where: {
                    id_instalacao_id_produto: {
                      id_instalacao: dto.id_instalacao,
                      id_produto: produto.id_produto,
                    },
                  },
                  create: {
                    id: ulid(),
                    id_instalacao: dto.id_instalacao,
                    id_produto: produto.id_produto,
                    actual: -new Decimal(produto.quantidade),
                  },
                  update: {
                    actual: {
                      decrement: +produto.quantidade,
                    },
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
        console.log({ error });
        throw new InternalServerErrorException('Ops! Erro no servidor', error);
      });
  }

  async remove(id: string) {
    return `This action removes a #${id} pedido`;
  }
}
