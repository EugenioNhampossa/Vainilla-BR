import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateContagemDto } from './dto/create-contagem.dto';
import { UpdateContagemDto } from './dto/update-contagem.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ulid } from 'ulid';
import { FilterContagemDto } from './dto/filter-contagem.dto';
import { formatDate, paginante } from 'src/utils';
import { ItemsContagem, Prisma } from '@prisma/client';

@Injectable()
export class ContagemService {
  constructor(private prisma: PrismaService) {}
  async create(createContagemDto: CreateContagemDto) {
    await this.prisma.contagem
      .create({
        data: {
          id: ulid(),
          dataContagem: formatDate(createContagemDto.data),
          ItemsContagem: {
            createMany: {
              data: createContagemDto.itens.map((item) => {
                return {
                  id: ulid(),
                  dataContagem: formatDate(createContagemDto.data),
                  ...item,
                };
              }),
            },
          },
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException('Ops! Erro no servidor.', error);
      });
  }

  async getTotal(data?: Date) {
    const contagem = await this.prisma.itemsContagem.findMany({
      where: {
        dataContagem: formatDate(data),
      },
      select: {
        qty_porPreparar: true,
        qty_preparada: true,
        Artigo: {
          select: {
            qtyTotal: true,
            valorTotal: true,
          },
        },
      },
    });

    const total = contagem.reduce(
      (acumulador, { qty_porPreparar, qty_preparada, Artigo }) => {
        const qty = qty_porPreparar.toNumber() + qty_preparada.toNumber();
        const preco = Artigo.valorTotal.toNumber() / Artigo.qtyTotal.toNumber();
        const total = qty * preco;
        return acumulador + total;
      },
      0,
    );
    return total;
  }

  async findAll(filter: FilterContagemDto) {
    const contagem = await paginante<
      ItemsContagem,
      Prisma.ItemsContagemFindManyArgs
    >(
      this.prisma.itemsContagem,
      {
        where: {
          dataContagem: formatDate(filter.data),
        },
        select: {
          id: true,
          qty_porPreparar: true,
          qty_preparada: true,
          dataCriacao: true,
          Artigo: {
            select: {
              titulo: true,
              codigo: true,
              unidade: true,
              qtyTotal: true,
              valorTotal: true,
            },
          },
        },
      },
      {
        page: filter.page,
        perPage: filter.perPage,
      },
    ).catch((error) => {
      throw new InternalServerErrorException('Ops! Erro no servidor.', error);
    });

    const total = await this.getTotal(filter.data);
    return { total, contagem };
  }

  async findOne(id: string) {
    return `This action returns a #${id} contagem`;
  }

  async update(id: string, updateContagemDto: UpdateContagemDto) {
    return `This action updates a #${updateContagemDto} contagem`;
  }

  remove(id: string) {
    return `This action removes a #${id} contagem`;
  }
}
