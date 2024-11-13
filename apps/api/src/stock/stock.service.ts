import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Stock } from '@prisma/client';
import { PaginatedResult } from 'prisma-pagination';
import { PrismaService } from '../prisma/prisma.service';
import { NumberFilterProps } from '../shared/@types';
import { buildNumberFilter, paginante } from '../utils';
import { CreateStockDto, FIlterStockDto, UpdateStockDto } from './dto';
import { ulid } from 'ulid';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async create(createStockDto: CreateStockDto): Promise<Stock> {
    const stock = await this.prisma.stock
      .create({
        data: {
          id: ulid(),
          ...createStockDto,
        },
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          throw new BadRequestException('Dados de stock já existem');
        }
        if (error.code === 'P2003') {
          throw new NotFoundException(
            'A instalação e/ou artigo seleccionado não existe',
          );
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });

    return stock;
  }

  async findAll(filter: FIlterStockDto): Promise<PaginatedResult<Stock>> {
    const actual: NumberFilterProps = {
      firstValue: filter?.aFirst,
      secondValue: filter?.aSecond,
      condition: filter?.aCondition,
    };

    const stockLIst = await paginante<Stock, Prisma.StockFindManyArgs>(
      this.prisma.stock,
      {
        where: {
          id_artigo: filter.id_artigo,
          id_instalacao: filter.id_instalacao,
          actual: buildNumberFilter(actual),
        },
        include: {
          Artigo: {
            select: {
              titulo: true,
              ItemCompra: {
                orderBy: {
                  dataCriacao: 'asc',
                },
                select: {
                  precoUnit: true,
                },
              },
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
    );

    return stockLIst;
  }

  async findOne(id: string): Promise<Stock> {
    const stock = await this.prisma.stock
      .findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          Artigo: {
            select: {
              titulo: true,
            },
          },
          Instalacao: {
            select: {
              titulo: true,
            },
          },
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException('Registro de stock não foi encontrado');
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });
    return stock;
  }

  async findByArtigo(id_instalacao: string, id_artigo: string): Promise<Stock> {
    const stock = await this.prisma.stock
      .findUnique({
        where: {
          id_instalacao_id_artigo: {
            id_instalacao: id_instalacao ? id_instalacao : 'id',
            id_artigo: id_artigo,
          },
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException('Registro de stock não foi encontrado');
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });
    return stock;
  }

  async update(id: string, updateStockDto: UpdateStockDto): Promise<Stock> {
    const newStock = await this.prisma.stock
      .update({
        where: {
          id,
        },
        data: {
          ...updateStockDto,
        },
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          throw new BadRequestException('Dados de stock já existem');
        }
        if (error.code === 'P2003') {
          throw new NotFoundException(
            'A instalação e/ou artigo seleccionado não existe',
          );
        }
        if (error.code === 'P2025') {
          throw new NotFoundException('Registro de stock não foi encontrado');
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });
    return newStock;
  }
}
