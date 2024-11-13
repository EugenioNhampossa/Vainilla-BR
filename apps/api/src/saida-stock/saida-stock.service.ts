import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateSaidaStockDto } from './dto/create-saida-stock.dto';
import { UpdateSaidaStockDto } from './dto/update-saida-stock.dto';
import { FilterSaidaStockDto } from './dto/filter-saida-stock.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ulid } from 'ulid';
import { formatDate, paginante } from 'src/utils';
import { Prisma, SaidaStock } from '@prisma/client';

@Injectable()
export class SaidaStockService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSaidaStockDto) {
    const data = {
      id: ulid(),
      id_instalacao: dto.id_instalacao,
      dataSaida: formatDate(),
      quantidade: dto.quantidade,
      tipo_item: dto.tipo_item,
      tipo_saida: dto.tipo_saida,
    };
    try {
      if (dto.tipo_item == 'Artigo') {
        await this.prisma.$transaction(async (tx) => {
          await tx.saidaStock.create({
            data: { ...data, id_artigo: dto.id_item },
          });

          await tx.stock.update({
            where: {
              id_instalacao_id_artigo: {
                id_artigo: dto.id_item,
                id_instalacao: dto.id_instalacao,
              },
            },
            data: {
              actual: {
                decrement: +dto.quantidade,
              },
            },
          });
        });
      } else if (dto.tipo_item == 'Produto') {
        await this.prisma.$transaction(async (tx) => {
          await tx.saidaStock.create({
            data: { ...data, id_produto: dto.id_item },
          }),
            await tx.stock_Producao.upsert({
              where: {
                id_instalacao_id_produto: {
                  id_instalacao: dto.id_instalacao,
                  id_produto: dto.id_item,
                },
              },
              create: {
                id: ulid(),
                id_instalacao: dto.id_instalacao,
                id_produto: dto.id_item,
                actual: 0 - dto.quantidade,
              },
              update: {
                actual: {
                  decrement: +dto.quantidade,
                },
              },
            });
        });
      } else {
        throw new BadRequestException('Tipo de item inválido');
      }
    } catch (erro) {
      throw new InternalServerErrorException('Ops! Erro no servidor');
    }
  }

  async findAll(filter: FilterSaidaStockDto) {
    const saida = paginante<SaidaStock, Prisma.SaidaStockFindManyArgs>(
      this.prisma.saidaStock,
      {
        where: {
          id_instalacao: filter.id_instalacao,
          dataSaida: {
            gte: formatDate(filter.dataInicio),
            lte: formatDate(filter.dataFim),
          },
        },
        select: {
          dataCriacao: true,
          quantidade: true,
          tipo_saida: true,
          Artigo: {
            select: {
              codigo: true,
              titulo: true,
              unidade: true,
            },
          },
          Produto: {
            select: {
              codigo: true,
              titulo: true,
            },
          },
          Instalacao: {
            select: {
              titulo: true,
            },
          },
        },
      },
      { page: filter.page, perPage: filter.perPage },
    ).catch(() => {
      throw new InternalServerErrorException('Ops! Erro no servidor');
    });

    return saida;
  }

  findOne(id: string) {
    return `This action returns a #${id} saidaStock`;
  }

  update(id: string, updateSaidaStockDto: UpdateSaidaStockDto) {
    return `This action updates a #${updateSaidaStockDto} saidaStock`;
  }

  remove(id: string) {
    return `This action removes a #${id} saidaStock`;
  }
}
