import { useInfiniteQuery, useQuery, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';

interface IFamiliaFilterProps {
  titulo?: string | undefined;
  codigo?: string | undefined;
}

const fetchFamilias = (
  { titulo, codigo }: IFamiliaFilterProps,
  page: number,
  perPage: number,
) => {
  let query = '';
  if (titulo) query += `&titulo=${titulo}`;
  if (codigo) query += `&codigo=${codigo}`;
  return api.get(`/familias?perPage=${perPage}&page=${page}${query}`);
};

export const useFamiliasData = ({
  onError,
  filter,
  page,
  perPage,
  enabled,
  select,
}: any) => {
  const queryClient = useQueryClient();

  return useQuery(
    ['familias', page, perPage, filter],
    () => fetchFamilias(filter, page, perPage),
    {
      onError,
      enabled,
      select,
    },
  );
};
