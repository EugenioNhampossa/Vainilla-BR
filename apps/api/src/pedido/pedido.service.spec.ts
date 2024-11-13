import { Test, TestingModule } from '@nestjs/testing';
import { PedidoService } from './pedido.service';
import { PrismaService } from '../prisma/prisma.service';
import { CaixaService } from '../caixa/caixa.service';

describe('PedidoService', () => {
  let service: PedidoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidoService,
        { provide: PrismaService, useValue: {} },
        { provide: CaixaService, useValue: {} },
      ],
    }).compile();

    service = module.get<PedidoService>(PedidoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
