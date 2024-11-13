import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Familia, Prisma } from '@prisma/client';
import { PaginatedResult } from 'prisma-pagination';
import { PrismaService } from '../prisma/prisma.service';
import { paginante } from '../utils';
import { FilterFamiliaDto } from './dto';
import { CreateFamiliaDto } from './dto/create-familia.dto';
import { UpdateFamiliaDto } from './dto/update-familia.dto';
import { ulid } from 'ulid';

@Injectable()
export class FamiliaService {
  constructor(private prisma: PrismaService) {}

  async create(createFamiliaDto: CreateFamiliaDto) {
    const familia = await this.prisma.familia
      .create({
        data: {
          id: ulid(),
          ...createFamiliaDto,
        },
        select: {
          id: true,
        },
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          throw new BadRequestException('O código da família já existe');
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });
    return familia;
  }

  async findAll(filter: FilterFamiliaDto): Promise<PaginatedResult<Familia>> {
    const listFamilia = await paginante<Familia, Prisma.FamiliaFindManyArgs>(
      this.prisma.familia,
      {
        where: {
          codigo: {
            contains: filter.codigo,
          },
          titulo: {
            contains: filter.titulo,
          },
        },
        include: {
          _count: {
            select: { SubFamilia: true },
          },
        },
      },
      { page: filter.page, perPage: filter.perPage },
    ).catch(() => {
      throw new InternalServerErrorException('Ops! erro no servidor.');
    });
    return listFamilia;
  }

  async findOne(id: string): Promise<Familia> {
    const familia = await this.prisma.familia
      .findFirstOrThrow({
        where: {
          id,
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException('A família não existe');
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });
    return familia;
  }

  async update(
    id: string,
    updateFamiliaDto: UpdateFamiliaDto,
  ): Promise<Familia> {
    const familia = await this.prisma.familia
      .update({
        where: {
          id,
        },
        data: {
          ...updateFamiliaDto,
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException('A família não existe');
        }
        if (error.code === 'P2002') {
          throw new BadRequestException('O código da família já existe');
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });

    return familia;
  }

  async remove(id: string): Promise<void> {
    await this.prisma.familia
      .delete({
        where: {
          id,
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException('A família não existe');
        }
        if (error.code === 'P2002') {
          throw new BadRequestException('O código da família já existe');
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });
  }
}
