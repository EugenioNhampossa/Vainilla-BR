import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Cliente, Prisma } from '@prisma/client';
import { PaginatedResult } from 'prisma-pagination';
import { PrismaService } from '../prisma/prisma.service';
import { paginante } from '../utils';
import { CreateClienteDto, FilterClienteDto, UpdateClienteDto } from './dto';
import { ulid } from 'ulid';

@Injectable()
export class ClienteService {
  constructor(private prisma: PrismaService) {}

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    const cliente = await this.prisma.cliente
      .create({
        data: {
          id: ulid(),
          ...createClienteDto,
        },
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          throw new BadRequestException('O nuit já foi cadastrado');
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });
    return cliente;
  }

  async findAll(filter: FilterClienteDto): Promise<PaginatedResult<Cliente>> {
    const listCLiente = await paginante<Cliente, Prisma.ClienteFindManyArgs>(
      this.prisma.cliente,
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
    return listCLiente;
  }

  async findOne(id: string): Promise<Cliente> {
    const cliente = await this.prisma.cliente
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException('O cliente não existe');
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });
    return cliente;
  }

  async update(
    id: string,
    updateClienteDto: UpdateClienteDto,
  ): Promise<Cliente> {
    const newCliente = await this.prisma.cliente
      .update({
        where: {
          id,
        },
        data: {
          ...updateClienteDto,
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException('O cliente não existe');
        }
        if (error.code === 'P2002') {
          throw new BadRequestException('O nuit já foi cadastrado');
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });

    return newCliente;
  }

  async remove(id: string): Promise<void> {
    await this.prisma.cliente
      .delete({
        where: {
          id,
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException('O cliente não existe');
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });
  }
}
