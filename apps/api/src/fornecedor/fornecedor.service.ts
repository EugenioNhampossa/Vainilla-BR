import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Fornecedor, Prisma } from '@prisma/client';
import { PaginatedResult } from 'prisma-pagination';
import { PrismaService } from '../prisma/prisma.service';
import { paginante } from '../utils';
import { FilterFornecedorDto } from './dto';
import { CreateFornecedorDto } from './dto/create-fornecedor.dto';
import { UpdateFornecedorDto } from './dto/update-fornecedor.dto';
import { ulid } from 'ulid';

@Injectable()
export class FornecedorService {
  constructor(private prisma: PrismaService) {}

  async create(createFornecedorDto: CreateFornecedorDto) {
    const fornecedor = await this.prisma.fornecedor
      .create({
        data: {
          id: ulid(),
          ...createFornecedorDto,
        },
        select: {
          id: true,
        },
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          throw new BadRequestException('Nuit do fornecedor já foi cadastrado');
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });
    return fornecedor;
  }

  async findAll(
    filter: FilterFornecedorDto,
  ): Promise<PaginatedResult<Fornecedor>> {
    const listFornecedor = await paginante<
      Fornecedor,
      Prisma.FornecedorFindManyArgs
    >(
      this.prisma.fornecedor,
      {
        where: {
          nuit: {
            contains: filter.nuit,
          },
          nome: {
            contains: filter.nome,
          },
          email: {
            contains: filter.email,
          },
        },
      },
      { page: filter.page, perPage: filter.perPage },
    );

    return listFornecedor;
  }

  async findOne(id: string): Promise<Fornecedor> {
    const fornecedor = await this.prisma.fornecedor
      .findFirstOrThrow({
        where: {
          id,
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException('O fornecedor não existe');
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });
    return fornecedor;
  }

  async update(id: string, updateFornecedorDto: UpdateFornecedorDto) {
    await this.prisma.fornecedor
      .update({
        where: {
          id,
        },
        data: {
          ...updateFornecedorDto,
        },
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          throw new BadRequestException('Nuit do fornecedor já foi cadastrado');
        }
        if (error.code === 'P2025') {
          throw new NotFoundException('O fornecedor não existe');
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.fornecedor
      .delete({
        where: {
          id,
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException('O fornecedor não existe');
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });
  }
}
