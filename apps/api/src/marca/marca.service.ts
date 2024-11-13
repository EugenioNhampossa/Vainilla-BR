import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Marca, Prisma } from '@prisma/client';
import { PaginatedResult } from 'prisma-pagination';
import { PrismaService } from '../prisma/prisma.service';
import { paginante } from '../utils';
import { CreateMarcaDto, FilterMarcaDto, UpdateMarcaDto } from './dto';
import { ulid } from 'ulid';

@Injectable()
export class MarcaService {
  constructor(private prisma: PrismaService) {}

  async create(createMarcaDto: CreateMarcaDto) {
    const marca = await this.prisma.marca
      .create({
        data: {
          id: ulid(),
          ...createMarcaDto,
        },
        select: {
          id: true,
        },
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            'Existe outra marca com o mesmo títiulo',
          );
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });

    return marca;
  }

  async findAll(filter: FilterMarcaDto): Promise<PaginatedResult<Marca>> {
    const listMarca = await paginante<Marca, Prisma.MarcaFindManyArgs>(
      this.prisma.marca,
      {
        where: {
          titulo: {
            contains: filter.titulo,
          },
        },
      },
      { page: filter.page, perPage: filter.perPage },
    );
    return listMarca;
  }

  async findOne(id: string): Promise<Marca> {
    const marca = await this.prisma.marca
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException('A marca não existe');
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });

    return marca;
  }

  async update(id: string, updateMarcaDto: UpdateMarcaDto) {
    await this.prisma.marca
      .update({
        where: {
          id,
        },
        data: {
          ...updateMarcaDto,
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException('A marca não existe');
        }
        if (error.code === 'P2002') {
          throw new BadRequestException(
            'Existe outra marca com o mesmo títiulo',
          );
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });
  }

  async remove(id: string) {
    await this.prisma.marca
      .delete({
        where: {
          id,
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException('A marca não existe');
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });
  }
}
