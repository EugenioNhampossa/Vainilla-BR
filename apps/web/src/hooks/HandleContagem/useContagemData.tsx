import { useQuery } from 'react-query';
import { api } from '../../Shared/api';
import { notify } from '../../Components/Modals/Notification';
import { DateRangePickerValue } from '@mantine/dates';

interface IContagemProps {
  id_instalacao?: string | undefined;
  data?: Date | undefined;
}

const fetchContagem = (
  filtro: IContagemProps,
  page: number,
  perPage: number,
) => {
  let query = '';
  if (filtro.data) {
    query += `&data=${filtro.data.toISOString()}`;
  }

  return api.get(`/contagens?perPage=${perPage}&page=${page}${query}`);
};

export const useContagem = ({ filter, page, perPage, select }: any) => {
  return useQuery(
    ['contagens', page, perPage, filter],
    () => fetchContagem(filter, page, perPage),
    {
      onError: (error) => {
        notify({
          data: error,
          title: 'Erro na busca da contagem',
          type: 'error',
        });
      },
      select,
    },
  );
};

interface IVariacaoProps {
  id_instalacao?: string;
  datas?: DateRangePickerValue;
}

const fetchVariance = (filtro: IVariacaoProps) => {
  let query = '';
  if (filtro.datas?.[0] && filtro.datas?.[1]) {
    query += `&dataInicio=${filtro.datas[0]?.toISOString()}`;
    query += `&dataFim=${filtro.datas[1]?.toISOString()}`;
  }

  if (filtro.id_instalacao) query += `&id_instalacao=${filtro.id_instalacao}`;
  return api.get(`/variacao-stock?${query}`);
};

export const useVariance = (filter: IVariacaoProps) => {
  return useQuery(['stock-variance', filter], () => fetchVariance(filter), {
    enabled: !!(filter.datas?.[1] && filter.datas?.[1]),
    onError: (error) => {
      notify({
        data: error,
        title: 'Erro na produção do relatório',
        type: 'error',
      });
    },
  });
};
