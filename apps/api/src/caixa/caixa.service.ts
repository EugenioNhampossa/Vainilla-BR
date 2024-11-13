import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCaixaDto, FilterCaixaDto, UpdateCaixaDto } from './dto';
import { Caixa, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { formatDate, paginante } from '../utils';
import { ulid } from 'ulid';
import { OpenSessionDto } from './dto/open-session.dto';
import { CloseSessionDto } from './dto/close-session.dto';

@Injectable()
export class CaixaService {
  constructor(private prisma: PrismaService) {}

  async create(createCaixaDto: CreateCaixaDto) {
    const caixa = await this.prisma.caixa
      .create({
        data: {
          id: ulid(),
          ...createCaixaDto,
        },
        select: {
          id: true,
        },
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            'O código do caixa já foi cadastrado e/ou usuário indisponível',
          );
        }
        if (error.code === 'P2003') {
          throw new NotFoundException('Usuário ou instalacao inexistente');
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });
    return caixa;
  }

  async findAll(filter: FilterCaixaDto) {
    const caixas = await paginante<Caixa, Prisma.CaixaFindManyArgs>(
      this.prisma.caixa,
      {
        where: {
          id_instalacao: filter.id_instalacao,
          is_open: filter.status ? filter.status === 'true' : {},
          codigo: {
            contains: filter.codigo,
          },
        },
        include: {
          Instalacao: {
            select: {
              titulo: true,
            },
          },
        },
      },
      { page: filter.page, perPage: filter.perPage },
    ).catch(() => {
      throw new InternalServerErrorException('Ops! Erro no servidor!');
    });
    return caixas;
  }

  async findOne(email: string) {
    const caixa = await this.prisma.caixa
      .findUniqueOrThrow({
        where: {
          email_usuario: email,
        },
        select: {
          id: true,
          codigo: true,
          id_sessao: true,
          is_open: true,
          Instalacao: {
            select: {
              titulo: true,
            },
          },
        },
      })
      .catch((error) => {
        console.log(error);

        if (error.code === 'P2025') {
          throw new NotFoundException(
            'O usuário não está associado a um caixa',
          );
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });

    return caixa;
  }

  async createEntryValue(dto: { valor: number; id_caixa: string }) {
    await this.prisma.entradaCaixa
      .create({
        data: {
          id: ulid(),
          id_caixa: dto.id_caixa,
          valor_entrada: dto.valor,
          data: formatDate(),
        },
      })
      .catch((error) => {
        console.log(error);

        throw new InternalServerErrorException('Ops! Erro no servidor');
      });
  }

  async createOutValue(dto: { valor: number; id_caixa: string }) {
    await this.prisma.saidaCaixa
      .create({
        data: {
          id: ulid(),
          id_caixa: dto.id_caixa,
          valor_saida: dto.valor,
          data: formatDate(),
        },
      })
      .catch((error) => {
        console.log(error);

        throw new InternalServerErrorException('Ops! Erro no servidor');
      });
  }

  async openSession(dto: OpenSessionDto) {
    const caixaAberto = await this.prisma.caixa
      .findFirst({
        where: {
          id: dto.id_caixa,
          is_open: true,
        },
        select: {
          id: true,
        },
      })
      .catch((error) => {
        console.log(error);

        throw new InternalServerErrorException('Ops! Erro no servidor!');
      });

    if (caixaAberto) {
      throw new ConflictException(
        'Já existe uma sessão aberta para este caixa.',
      );
    }

    await this.prisma
      .$transaction(
        async (tx) => {
          const sessao = await tx.sessoesCaixa.create({
            data: {
              id: ulid(),
              id_caixa: dto.id_caixa,
              data_abertura: new Date(),
            },
            select: {
              id: true,
            },
          });

          await this.createEntryValue({
            id_caixa: dto.id_caixa,
            valor: dto.valor_entrada,
          });

          await tx.caixa.update({
            where: {
              id: dto.id_caixa,
            },
            data: {
              is_open: true,
              id_sessao: sessao.id,
            },
          });
        },
        {
          maxWait: 5000,
          timeout: 60000,
        },
      )
      .catch((error) => {
        console.log(error);
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });
  }

  async closeSession(id_caixa: string, dto: CloseSessionDto) {
    const caixaAberto = await this.prisma.caixa
      .findFirst({
        where: {
          id: id_caixa,
          is_open: true,
        },
        select: {
          id_sessao: true,
        },
      })
      .catch(() => {
        throw new InternalServerErrorException('Ops! Erro no servidor!');
      });

    if (!caixaAberto) {
      throw new ConflictException(
        'Não existe uma sessão aberta para este caixa.',
      );
    }

    await this.prisma
      .$transaction(
        async (tx) => {
          await tx.sessoesCaixa.update({
            where: {
              id: caixaAberto.id_sessao,
            },
            data: {
              data_fechamento: new Date(),
            },
          });

          await tx.caixa.update({
            where: {
              id: id_caixa,
            },
            data: {
              id_sessao: null,
              is_open: false,
            },
          });

          await tx.encerramentoCaixa.create({
            data: {
              id: ulid(),
              ...dto,
            },
          });
        },
        {
          maxWait: 5000,
          timeout: 70000,
        },
      )
      .catch(() => {
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });
  }

  async update(id: string, updateCaixaDto: UpdateCaixaDto) {
    const caixa = await this.prisma.caixa
      .update({
        where: {
          id,
        },
        data: {
          ...updateCaixaDto,
        },
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          throw new BadRequestException('O código do caixa já foi cadastrado');
        }
        if (error.code === 'P2003') {
          throw new NotFoundException('Usuário ou instalação inexistente');
        }
        if (error.code === 'P2025') {
          throw new NotFoundException('O caixa não existe');
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });
    return caixa;
  }

  async remove(id: string): Promise<void> {
    await this.prisma.caixa
      .delete({
        where: {
          id,
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException('O caixa não existe');
        }
        throw new InternalServerErrorException('Ops! erro no servidor.');
      });
  }
}
