import { useEffect, useState } from 'react';
import { Pedido } from '../../../Store/pedido/pedido-slice';

export const calculate = (pedido: Pedido) => {
  let total = pedido.ItemPedido.reduce((acumulator, item) => {
    const desconto = (item.desconto * item.preco) / 100;
    return acumulator + (item.preco - desconto) * item.quantidade;
  }, 0);

  let totalLiq = total - (total * pedido.desconto) / 100;

  let subtotal = totalLiq;
  return { total, subtotal, totalLiq };
};

export const useCalc = (pedido: Pedido) => {
  const [calc, setCalc] = useState({
    total: 0,
    subtotal: 0,
    totalLiq: 0,
  });

  useEffect(() => {
    const result = calculate(pedido);
    setCalc(result);
  }, [pedido]);

  return calc;
};
