import { useQuery } from 'react-query';
import { api } from '../../Shared/api';

interface IMarcaFilterProps {
  titulo?: string | undefined;
}

const fetchMarcas = (
  { titulo }: IMarcaFilterProps,
  page: number,
  perPage: number,
) => {
  let query = '';
  if (titulo) query += `&titulo=${titulo}`;
  return api.get(`/marcas?perPage=${perPage}&page=${page}${query}`);
};

export const useMarcasData = ({
  onError,
  filter,
  page,
  perPage,
  enabled,
  select,
}: any) => {
  return useQuery(
    ['marcas', page, perPage, filter],
    () => fetchMarcas(filter, page, perPage),
    {
      onError,
      enabled,
      select,
    },
  );
};
