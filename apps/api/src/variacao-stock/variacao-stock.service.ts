import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { formatDate } from 'src/utils';
import { FilterVariacaoDto } from './dto/filter-variacao.dto';

@Injectable()
export class VariacaoStockService {
  constructor(private prisma: PrismaService) {}

  async contagemInicial(data: Date) {
    const contagemInical = await this.prisma.itemsContagem
      .findMany({
        where: {
          dataContagem: formatDate(data),
        },
        select: {
          qty_porPreparar: true,
          qty_preparada: true,
          Artigo: {
            select: {
              id: true,
              codigo: true,
              unidade: true,
              titulo: true,
              qtyTotal: true,
              valorTotal: true,
              ItemCompra: {
                select: {
                  quantidade: true,
                },
              },
              EntradaStock: {
                select: {
                  quantidade: true,
                },
              },
              SaidaStock: {
                select: {
                  tipo_saida: true,
                  quantidade: true,
                },
              },
            },
          },
        },
      })
      .catch(() => {
        throw new InternalServerErrorException('Ops! Erro no servidor');
      });

    if (!contagemInical.length) {
      throw new BadRequestException(
        `Não existe uma contagem de stock para o dia ${new Date(
          formatDate(data),
        ).toLocaleDateString('pt')}`,
      );
    }

    return contagemInical;
  }

  async contagemFinal(data: Date) {
    const contagemFinal = await this.prisma.itemsContagem
      .findMany({
        where: {
          dataContagem: formatDate(data),
        },
        select: {
          id_artigo: true,
          qty_porPreparar: true,
          qty_preparada: true,
        },
      })
      .catch(() => {
        throw new InternalServerErrorException('Ops! Erro no servidor');
      });
    return contagemFinal;
  }

  async pedidos(dto: FilterVariacaoDto) {
    const pedidos = await this.prisma.pedido
      .findMany({
        where: {
          dataPedido: {
            gte: formatDate(dto.dataInicio),
            lte: formatDate(dto.dataFim),
          },
        },
        select: {
          ItemPedido: {
            select: {
              id_produto: true,
              quantidade: true,
            },
          },
        },
      })
      .catch(() => {
        throw new InternalServerErrorException('Ops! Erro no servidor');
      });

    return pedidos;
  }

  async transferencias(dto: FilterVariacaoDto) {
    const transPosetiva = await this.prisma.transfereciaStock
      .findMany({
        where: {
          dataTrans: {
            gte: formatDate(dto.dataInicio),
            lte: formatDate(dto.dataFim),
          },
          id_estDestino: dto.id_instalacao,
        },
        select: {
          Item: {
            select: {
              id_artigo: true,
              quantidade: true,
            },
          },
        },
      })
      .catch(() => {
        throw new InternalServerErrorException('Ops! Erro no servidor');
      });

    const transNegativa = await this.prisma.transfereciaStock
      .findMany({
        where: {
          dataTrans: {
            gte: formatDate(dto.dataInicio),
            lte: formatDate(dto.dataFim),
          },
          id_estPartida: dto.id_instalacao,
        },
        select: {
          Item: {
            select: {
              id_artigo: true,
              quantidade: true,
            },
          },
        },
      })
      .catch(() => {
        throw new InternalServerErrorException('Ops! Erro no servidor');
      });

    return { transNegativa, transPosetiva };
  }

  async getItensProduto(id_produto: string) {
    const prod_itens = await this.prisma.produto_Item
      .findMany({
        where: {
          id_produto,
        },
        select: {
          id_artigo: true,
          quantidade: true,
        },
      })
      .catch(() => {
        throw new InternalServerErrorException('Ops! Erro no servidor');
      });
    return prod_itens;
  }

  async saidasStock(dto: FilterVariacaoDto) {
    const saidas = await this.prisma.saidaStock
      .findMany({
        where: {
          dataSaida: {
            gte: formatDate(dto.dataInicio),
            lte: formatDate(dto.dataFim),
          },
          tipo_item: 'Produto',
        },
        select: {
          id_produto: true,
          quantidade: true,
          tipo_saida: true,
        },
      })
      .catch(() => {
        throw new InternalServerErrorException('Ops! Erro no servidor');
      });

    return saidas;
  }

  async getStockVariance(dto: FilterVariacaoDto) {
    const contagemInical = await this.contagemInicial(dto.dataInicio);
    const contagemFinal = await this.contagemFinal(dto.dataFim);
    const transferecias = await this.transferencias(dto);
    const saidas = await this.saidasStock(dto);
    const pedidos = await this.pedidos(dto);

    try {
      const variacao = await Promise.all(
        contagemInical.map(async (item) => {
          let totalPedidos = 0;
          let totalDesperdicios = 0;
          let totalOfertas = 0;
          let stockFinal = 0;

          await Promise.all(
            pedidos.map((ped) => {
              ped.ItemPedido.map(async (itemPed) => {
                const artigos = await this.getItensProduto(itemPed.id_produto);
                artigos.map((artigo) => {
                  if (artigo.id_artigo == item.Artigo.id) {
                    totalPedidos +=
                      itemPed.quantidade.toNumber() *
                      artigo.quantidade.toNumber();
                  }
                });
              });
            }),
          );

          await Promise.all(
            saidas.map(async (saida) => {
              const artigos = await this.getItensProduto(saida.id_produto);
              artigos.map((artigo) => {
                if (artigo.id_artigo == item.Artigo.id) {
                  if (saida.tipo_saida == 'Desperdicio') {
                    totalDesperdicios +=
                      saida.quantidade.toNumber() *
                      artigo.quantidade.toNumber();
                  } else {
                    totalOfertas +=
                      saida.quantidade.toNumber() *
                      artigo.quantidade.toNumber();
                  }
                }
              });
            }),
          );

          await Promise.all(
            saidas.map(async (saida) => {
              const artigos = await this.getItensProduto(saida.id_produto);
              artigos.map((artigo) => {
                if (artigo.id_artigo == item.Artigo.id) {
                  totalDesperdicios +=
                    saida.quantidade.toNumber() * artigo.quantidade.toNumber();
                }
              });
            }),
          );

          if (contagemFinal) {
            contagemFinal.forEach((element) => {
              if (element.id_artigo == item.Artigo.id) {
                stockFinal =
                  element.qty_porPreparar.toNumber() +
                  element.qty_preparada.toNumber();
              }
            });
          }

          return {
            id_artigo: item.Artigo.id,
            codigo: item.Artigo.codigo,
            titulo: item.Artigo.titulo,
            unidade: item.Artigo.unidade,
            totalPedidos,
            precoCusto:
              item.Artigo.valorTotal.toNumber() /
              item.Artigo.qtyTotal.toNumber(),
            stock_inicial:
              item.qty_porPreparar.toNumber() + item.qty_preparada.toNumber(),
            compras: item.Artigo.ItemCompra.reduce(
              (acumulador, { quantidade }) =>
                acumulador + quantidade.toNumber(),
              0,
            ),
            entradas: item.Artigo.EntradaStock.reduce(
              (acumulador, { quantidade }) =>
                acumulador + quantidade.toNumber(),
              0,
            ),
            desperdicios: item.Artigo.SaidaStock.reduce(
              (acumulador, { quantidade, tipo_saida }) => {
                if (tipo_saida == 'Desperdicio') {
                  return acumulador + quantidade.toNumber();
                } else {
                  return acumulador;
                }
              },
              totalDesperdicios,
            ),
            ofertas: item.Artigo.SaidaStock.reduce(
              (acumulador, { quantidade, tipo_saida }) => {
                if (tipo_saida == 'Oferta') {
                  return acumulador + quantidade.toNumber();
                } else {
                  return acumulador;
                }
              },
              totalOfertas,
            ),
            transSaida: transferecias.transNegativa.reduce(
              (acumulador, { Item }) => {
                return (
                  acumulador +
                  Item.reduce((acumulador, { quantidade, id_artigo }) => {
                    if (id_artigo == item.Artigo.id) {
                      return acumulador + quantidade.toNumber();
                    } else {
                      return acumulador;
                    }
                  }, 0)
                );
              },
              0,
            ),
            transEntrada: transferecias.transPosetiva.reduce(
              (acumulador, { Item }) => {
                return (
                  acumulador +
                  Item.reduce((acumulador, { quantidade, id_artigo }) => {
                    if (id_artigo == item.Artigo.id) {
                      return acumulador + quantidade.toNumber();
                    } else {
                      return acumulador;
                    }
                  }, 0)
                );
              },
              0,
            ),
            stock_final: stockFinal,
          };
        }),
      );

      let totalPerda = 0;
      const variacao2 = variacao.map((values) => {
        const qtyReal =
          values.stock_inicial +
          values.compras +
          values.transEntrada -
          values.transSaida -
          values.desperdicios -
          values.ofertas -
          values.stock_final;

        const transTotal = values.transEntrada - values.transSaida;

        const diferenca = values.totalPedidos - qtyReal;
        totalPerda += diferenca * values.precoCusto;
        return {
          ...values,
          transTotal,
          qtyReal,
          diferenca,
          valor: values.precoCusto * values.stock_final,
        };
      });

      return { totalPerda, variacao: variacao2 };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Erro no servidor');
    }
  }
}
