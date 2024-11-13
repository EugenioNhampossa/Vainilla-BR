import { useQuery } from 'react-query';
import { api } from '../../Shared/api';

interface ICaixaFilterProps {
  id_instalacao?: string | undefined;
  codigo?: string | undefined;
}

const fetchCaixas = (
  { id_instalacao, codigo }: ICaixaFilterProps,
  page: number,
  perPage: number,
) => {
  let query = '';
  if (id_instalacao) query += `&id_instalacao=${id_instalacao}`;
  if (codigo) query += `&codigo=${codigo}`;
  return api.get(`/caixas?perPage=${perPage}&page=${page}${query}`);
};

export const useCaixasData = ({
  onError,
  filter,
  page,
  perPage,
  enabled,
  select,
}: any) => {
  return useQuery(
    ['caixas', page, perPage, filter],
    () => fetchCaixas(filter, page, perPage),
    {
      onError,
      enabled,
      select,
    },
  );
};
