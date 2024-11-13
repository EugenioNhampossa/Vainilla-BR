import { useQuery } from 'react-query';
import { api } from '../../Shared/api';

interface ISubFamiliaFilterProps {
  titulo?: string | undefined;
  codigo?: string | undefined;
}

const fetchSubFamilias = (
  { titulo, codigo }: ISubFamiliaFilterProps,
  page: number,
  perPage: number,
  idfamilia: string,
) => {
  let query = '';
  if (titulo) query += `&titulo=${titulo}`;
  if (codigo) query += `&codigo=${codigo}`;
  if (!idfamilia) idfamilia = 'undefined';
  return api.get(
    `/subfamilias/familia/${idfamilia}?perPage=${perPage}&page=${page}${query}`,
  );
};

export const useSubFamiliasData = ({
  onError,
  filter,
  page,
  perPage,
  enabled,
  select,
  idFilter: idfamilia,
}: any) => {
  return useQuery(
    ['subfamilias', idfamilia, page, perPage, filter],
    () => fetchSubFamilias(filter, page, perPage, idfamilia),
    {
      onError,
      enabled,
      select,
    },
  );
};
