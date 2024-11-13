import { useQuery } from 'react-query';
import { api } from '../../Shared/api';
import { notify } from '../../Components/Modals/Notification';

interface ICompraFilterProps {
  data?: Date | undefined;
}

const fetchCompras = (
  { data }: ICompraFilterProps,
  page: number,
  perPage: number,
) => {
  let query = '';
  if (data) query += `&data=${data.toISOString()}`;
  return api.get(`/compras?perPage=${perPage}&page=${page}${query}`);
};

export const useCompraData = ({ filter, page, perPage }: any) => {
  return useQuery(
    ['compras', page, perPage, filter],
    () => fetchCompras(filter, page, perPage),
    {
      onError: (error) => {
        notify({
          data: error,
          title: 'Erro no Registro do Artigo',
          type: 'error',
        });
      },
    },
  );
};
