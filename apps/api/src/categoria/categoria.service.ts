import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ulid } from 'ulid';
import { FilterCategoriaDto } from './dto/filter-categoria.dto';
import { paginante } from '../utils';
import { Categoria, Prisma } from '@prisma/client';

@Injectable()
export class CategoriaService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoriaDto: CreateCategoriaDto) {
    const categoria = await this.prisma.categoria
      .create({
        data: {
          id: ulid(),
          ...createCategoriaDto,
        },
        select: {
          id: true,
        },
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          throw new BadRequestException('O código da categoria já existe');
        }
        throw new InternalServerErrorException(error);
      });
    return categoria;
  }

  async findAll(filter: FilterCategoriaDto) {
    const categorias = await paginante<Categoria, Prisma.CategoriaFindManyArgs>(
      this.prisma.categoria,
      {
        where: {
          codigo: filter.codigo,
          titulo: {
            contains: filter.titulo,
          },
        },
        select: {
          id: true,
          _count: true,
          codigo: true,
          titulo: true,
        },
      },
      { page: filter.page, perPage: filter.perPage },
    ).catch((error) => {
      throw new InternalServerErrorException(error);
    });
    return categorias;
  }

  async findOne(id: string) {
    const categoria = await this.prisma.categoria
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException('A categoria não existe');
        }
        throw new InternalServerErrorException(error);
      });
    return categoria;
  }

  async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    await this.prisma.categoria
      .update({
        where: {
          id,
        },
        data: {
          ...updateCategoriaDto,
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException('A categoria não existe');
        }
        if (error.code === 'P2002') {
          throw new BadRequestException(
            'O código/titulo da categoria já existe',
          );
        }
        throw new InternalServerErrorException(error);
      });
  }

  remove(id: number) {
    return `This action removes a #${id} categoria`;
  }
}
