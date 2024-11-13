import { useQuery } from 'react-query';
import { api } from '../../Shared/api';
import { notify } from '../../Components/Modals/Notification';
import { DateRangePickerValue } from '@mantine/dates';

interface IPedidoFilterProps {
  codigo?: string;
  datas?: DateRangePickerValue;
}

const fetchPedidos = (
  { codigo, datas }: IPedidoFilterProps,
  page: number,
  perPage: number,
) => {
  let query = '';
  if (codigo) query += `&codigo=${codigo}`;
  if (datas?.[0]) query += `&dataInicio=${datas[0]?.toISOString()}`;
  if (datas?.[1]) query += `&dataFim=${datas[1]?.toISOString()}`;
  return api.get(`/pedidos?perPage=${perPage}&page=${page}${query}`);
};

export const usePedidosData = ({ filter, page, perPage }: any) => {
  return useQuery(
    ['pedidos', page, perPage, filter],
    () => fetchPedidos(filter, page, perPage),
    {
      onError: (error) => {
        notify({
          data: error,
          title: 'Erro na busca dos pedidos.',
          type: 'error',
        });
      },
    },
  );
};

const fetchTotalValuesPerSession = (id: string) => {
  return api.get(`/pedidos/total-por-sessao/${id}`);
};

export const useGetTotalValuesPerSession = (filter: { id_sessao: string }) => {
  return useQuery(
    ['valor-pedidos-por-sessao'],
    () => fetchTotalValuesPerSession(filter.id_sessao),
    {
      enabled: !!filter.id_sessao,
      onError: (error) => {
        notify({
          data: error,
          title: 'Erro na busca dos dados',
          type: 'error',
        });
      },
    },
  );
};

const fetchPedidoById = (id: string) => {
  return api.get(`/pedidos/${id}`);
};

export const usefetchPedidoByID = (id: string) => {
  return useQuery(['pedidos', id], () => fetchPedidoById(id), {
    onError: (error) => {
      notify({
        data: error,
        title: 'Erro na busca dos dados do pedido',
        type: 'error',
      });
    },
  });
};

const getOpenOrders = (filter?: { estado?: string; codigo?: string }) => {
  let query = '';
  if (filter?.codigo) query += `&codigo=${filter?.codigo}`;
  if (filter?.estado && filter?.estado != 'TODOS')
    query += `&estado=${filter?.estado}`;
  return api.get(`/pedidos/open?${query}`);
};

export const useGetOpenOrders = (filter?: {
  estado?: string;
  codigo?: string;
}) => {
  return useQuery(['openOrders', { filter }], () => getOpenOrders(filter), {
    onError: (error) => {
      notify({
        data: error,
        title: 'Erro na busca dos dados',
        type: 'error',
      });
    },
  });
};

const getMetrics = (datas?: DateRangePickerValue) => {
  let query = '';
  if (datas?.[0]) query += `&dataInicio=${datas[0]?.toISOString()}`;
  if (datas?.[1]) query += `&dataFim=${datas[1]?.toISOString()}`;
  return api.get(`/pedidos/metrics?${query}`);
};

export const useGetMetrics = (datas?: DateRangePickerValue) => {
  return useQuery(['pedidos', 'metrics', datas], () => getMetrics(datas), {
    onError: (error) => {
      notify({
        data: error,
        title: 'Erro na busca dos dados',
        type: 'error',
      });
    },
  });
};

const fetchGetTotalVendas = ({ codigo, datas }: IPedidoFilterProps) => {
  let query = '';
  if (codigo) query += `&codigo_produto=${codigo}`;
  if (datas?.[0]) query += `&dataInicio=${datas[0]?.toISOString()}`;
  if (datas?.[1]) query += `&dataFim=${datas[1]?.toISOString()}`;
  return api.get(`/pedidos/vendas-por-produto?${query}`);
};

export const useGetTotalVendas = (filter: IPedidoFilterProps) => {
  return useQuery(
    ['pedidos-por-produto', filter],
    () => fetchGetTotalVendas(filter),
    {
      onError: (error) => {
        notify({
          data: error,
          title: 'Erro na busca dos pedidos.',
          type: 'error',
        });
      },
    },
  );
};
