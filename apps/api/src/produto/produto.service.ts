import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ulid } from 'ulid';
import { FilterProdutoDto } from './dto/filter-produto.dto';
import { paginante } from '../utils';
import { Prisma, Produto } from '@prisma/client';

@Injectable()
export class ProdutoService {
  constructor(private prisma: PrismaService) {}

  async createProduto(dto: CreateProdutoDto) {
    const produto = await this.prisma.produto
      .create({
        data: {
          id: ulid(),
          isCombo: false,
          codigo: dto.codigo,
          titulo: dto.titulo,
          preco: dto.preco,
          precoCusto: dto.precoCusto,
          id_categoria: dto.id_categoria,
          imagem: dto.imagem,
          qtyPorReceita: dto.qtyPorReceita,
          Produto_Item: {
            createMany: {
              data: dto.itens.map((item) => {
                return {
                  id: ulid(),
                  id_artigo: item.id_item,
                  quantidade: item.quantidade,
                };
              }),
            },
          },
        },
        select: {
          id: true,
        },
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            'O código e/ou título do produto  já existe',
          );
        }
        throw new InternalServerErrorException(error);
      });
    return produto;
  }

  async createCombo(dto: CreateProdutoDto) {
    const produto = await this.prisma.produto
      .create({
        data: {
          id: ulid(),
          isCombo: true,
          codigo: dto.codigo,
          titulo: dto.titulo,
          precoCusto: dto.precoCusto,
          preco: dto.preco,
          id_categoria: dto.id_categoria,
          imagem: dto.imagem,
          Composto: {
            createMany: {
              data: dto.itens.map((item) => {
                return {
                  id: ulid(),
                  id_item: item.id_item,
                  quantidade: item.quantidade,
                };
              }),
            },
          },
        },
        select: {
          id: true,
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException('O produto não existe');
        }
        if (error.code === 'P2002') {
          throw new BadRequestException(
            'O código e/ou título do produto  já existe',
          );
        }
        throw new InternalServerErrorException(error);
      });
    return produto;
  }

  async findAll(filter: FilterProdutoDto) {
    const produtos = await paginante<Produto, Prisma.ProdutoFindManyArgs>(
      this.prisma.produto,
      {
        where: {
          isCombo: filter.isCombo,
          id_categoria: filter.id_categoria,
          codigo: filter.codigo,
          titulo: {
            contains: filter.titulo,
            mode: 'insensitive',
          },
        },
        include: {
          Categoria: {
            select: {
              titulo: true,
            },
          },
        },
      },
      { page: filter.page, perPage: filter.perPage },
    ).catch((error) => {
      throw new InternalServerErrorException(error);
    });
    return produtos;
  }

  async findOne(id: string) {
    const produto = await this.prisma.produto
      .findUniqueOrThrow({
        where: {
          id,
        },
        select: {
          id: true,
          titulo: true,
          preco: true,
          precoCusto: true,
          codigo: true,
          isCombo: true,
          descricao: true,
          qtyPorReceita: true,
          Categoria: {
            select: {
              id: true,
              titulo: true,
            },
          },
          Composto: {
            select: {
              quantidade: true,
              Item: {
                select: {
                  id: true,
                  titulo: true,
                  precoCusto: true,
                },
              },
            },
          },
          Produto_Item: {
            select: {
              quantidade: true,
              Artigo: {
                select: {
                  id: true,
                  titulo: true,
                  unidade: true,
                  qtyTotal: true,
                  valorTotal: true,
                },
              },
            },
          },
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException('O produto não existe');
        }
        throw new InternalServerErrorException(error);
      });
    return produto;
  }

  async updateProduto(id: string, dto: UpdateProdutoDto) {
    await this.prisma
      .$transaction(async (tx) => {
        await tx.produto_Item.deleteMany({
          where: {
            id_produto: id,
          },
        });

        if (dto.itens) {
          await tx.produto_Item.createMany({
            data: dto.itens.map((item) => {
              return {
                id: ulid(),
                id_produto: id,
                id_artigo: item.id_item,
                quantidade: item.quantidade,
              };
            }),
          });
        }

        await tx.produto.update({
          where: {
            id,
          },
          data: {
            codigo: dto.codigo,
            titulo: dto.titulo,
            precoCusto: dto.precoCusto,
            preco: dto.preco,
            id_categoria: dto.id_categoria,
            imagem: dto.imagem,
          },
        });
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException('O produto não existe');
        }
        if (error.code === 'P2002') {
          throw new BadRequestException('O código do produto já existe');
        }
        throw new InternalServerErrorException(error);
      });
  }

  async updateCombo(id: string, dto: UpdateProdutoDto) {
    await this.prisma
      .$transaction(async (tx) => {
        await tx.combo.deleteMany({
          where: {
            id_produto: id,
          },
        });

        if (dto.itens) {
          await tx.combo.createMany({
            data: dto.itens.map((item) => {
              return {
                id: ulid(),
                id_produto: id,
                id_item: item.id_item,
                quantidade: item.quantidade,
              };
            }),
          });
        }
        await tx.produto.update({
          where: {
            id,
          },
          data: {
            codigo: dto.codigo,
            titulo: dto.titulo,
            precoCusto: dto.precoCusto,
            preco: dto.preco,
            id_categoria: dto.id_categoria,
            imagem: dto.imagem,
          },
        });
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException('O produto não existe');
        }
        if (error.code === 'P2002') {
          throw new BadRequestException('O código do produto já existe');
        }
        throw new InternalServerErrorException(error);
      });
  }

  async remove(id: number) {
    return `This action removes a #${id} produto`;
  }
}
