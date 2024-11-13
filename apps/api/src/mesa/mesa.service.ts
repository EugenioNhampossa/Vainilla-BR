import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ulid } from 'ulid';
import { FilterMesaDto } from './dto/filter-mesa.dto';
import { paginante } from '../utils';
import { Mesa, Prisma } from '@prisma/client';

@Injectable()
export class MesaService {
  constructor(private prisma: PrismaService) {}

  async create(createMesaDto: CreateMesaDto) {
    const mesa = await this.prisma.mesa
      .create({
        data: {
          id: ulid(),
          ...createMesaDto,
        },
        select: {
          id: true,
        },
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          throw new BadRequestException('O código da mesa já existe');
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });
    return mesa;
  }

  async findAll(filter: FilterMesaDto) {
    const mesas = await paginante<Mesa, Prisma.MesaFindManyArgs>(
      this.prisma.mesa,
      {
        where: {
          id_instalacao: filter.id_instalacao,
          codigo: filter.codigo,
        },
      },
      { page: filter.page, perPage: filter.perPage },
    ).catch(() => {
      throw new InternalServerErrorException('Ops! erro no servidor.');
    });
    return mesas;
  }

  async findOne(id: string) {
    const mesa = await this.prisma.mesa
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException('A mesa não existe');
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });
    return mesa;
  }

  async update(id: string, updateMesaDto: UpdateMesaDto) {
    await this.prisma.mesa
      .update({
        where: {
          id,
        },
        data: {
          ...updateMesaDto,
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException('A mesa não existe');
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });
  }

  remove(id: number) {
    return `This action removes a #${id} mesa`;
  }
}
