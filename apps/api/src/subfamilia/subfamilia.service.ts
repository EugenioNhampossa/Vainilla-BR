import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, SubFamilia } from '@prisma/client';
import { PaginatedResult } from 'prisma-pagination';
import { PrismaService } from '../prisma/prisma.service';
import { paginante } from '../utils';
import { FilterSubfamilia } from './dto';
import { CreateSubfamiliaDto } from './dto/create-subfamilia.dto';
import { UpdateSubfamiliaDto } from './dto/update-subfamilia.dto';
import { ulid } from 'ulid';

@Injectable()
export class SubfamiliaService {
  constructor(private prisma: PrismaService) {}

  async create(createSubfamiliaDto: CreateSubfamiliaDto): Promise<SubFamilia> {
    const subfamilia = await this.prisma.subFamilia
      .create({
        data: {
          id: ulid(),
          ...createSubfamiliaDto,
        },
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          throw new BadRequestException('O código da sub-família já existe');
        }
        if (error.code === 'P2003') {
          throw new NotFoundException('A famíla seleccionada não existe');
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });
    return subfamilia;
  }

  async findByFamilia(
    id_familia: string,
    filter: FilterSubfamilia,
  ): Promise<PaginatedResult<SubFamilia>> {
    const listSubFamilia = await paginante<
      SubFamilia,
      Prisma.SubFamiliaFindManyArgs
    >(
      this.prisma.subFamilia,
      {
        where: {
          id_familia,
          codigo: {
            contains: filter.codigo,
          },
          titulo: {
            contains: filter.titulo,
          },
        },
        include: {
          Familia: {
            select: {
              codigo: true,
              titulo: true,
              descricao: true,
            },
          },
        },
      },
      { page: filter.page, perPage: filter.perPage },
    );
    return listSubFamilia;
  }

  async findOne(id: string): Promise<SubFamilia> {
    const subFamilia = await this.prisma.subFamilia
      .findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          Familia: {
            select: {
              codigo: true,
              titulo: true,
              descricao: true,
            },
          },
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException('A subfamilia não existe');
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });

    return subFamilia;
  }

  async update(
    id: string,
    updateSubfamiliaDto: UpdateSubfamiliaDto,
  ): Promise<SubFamilia> {
    const newSubFamilia = await this.prisma.subFamilia
      .update({
        where: {
          id,
        },
        data: {
          ...updateSubfamiliaDto,
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException('A subfamilia não existe');
        }
        if (error.code === 'P2002') {
          throw new BadRequestException('O código da sub-familia já existe');
        }
        if (error.code === 'P2003') {
          throw new NotFoundException('A família seleccionada não existe');
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });

    return newSubFamilia;
  }

  async remove(id: string): Promise<void> {
    await this.prisma.subFamilia
      .delete({
        where: {
          id,
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException('A subfamilia não existe');
        }
        if (error.code === 'P2002') {
          throw new BadRequestException('O código da sub-familia já existe');
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });
  }
}
