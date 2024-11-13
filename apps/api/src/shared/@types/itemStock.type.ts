import { Decimal } from '@prisma/client/runtime/library';

export type itemStock = {
  id_artigo: string;
  quantidade: Decimal;
};

export type itemPedido = {
  id: string;
  id_produto: string;
  quantidade: Decimal;
  desconto?: Decimal;
  titulo: string;
  preco: string;
  confirmado?: boolean;
};
