import { useQuery } from 'react-query';
import { api } from '../../Shared/api';
import { notify } from '../../Components/Modals/Notification';
import { DateRangePickerValue } from '@mantine/dates';

const fetchEntradasStock = (
  page: number,
  perPage: number,
  {
    datas,
    id_instalacao,
  }: { datas?: DateRangePickerValue; id_instalacao?: string },
) => {
  let query = '';
  if (id_instalacao) query += `&id_instalacao=${id_instalacao}`;
  if (datas?.[0]) query += `&dataInicio=${datas[0]?.toISOString()}`;
  if (datas?.[1]) query += `&dataFim=${datas[1]?.toISOString()}`;
  return api.get(`/entradas-stock?perPage=${perPage}&page=${page}${query}`);
};

export const useEntradasStockData = ({ filter, page, perPage }: any) => {
  return useQuery(
    ['entradas', page, perPage, filter],
    () => fetchEntradasStock(page, perPage, filter),
    {
      onError: (error) => {
        notify({
          data: error,
          title: 'Erro na busca das entradas de stock.',
          type: 'error',
        });
      },
    },
  );
};
