import { useQuery } from 'react-query';
import { api } from '../../Shared/api';

interface IStockFilterProps {
  id_artigo?: string | undefined;
  id_instalacao?: string | undefined;
  aFirst?: string | undefined;
  aSecond?: string | undefined;
  aCondition?: string | undefined;
}

const fetchStock = (
  filtro: IStockFilterProps,
  page: number,
  perPage: number,
) => {
  let query = '';
  if (filtro.id_artigo) query += `&id_artigo=${filtro.id_artigo}`;
  if (filtro.id_instalacao) query += `&id_instalacao=${filtro.id_instalacao}`;
  if (filtro.aFirst) query += `&aFirst=${filtro.aFirst}`;
  if (filtro.aSecond) query += `&aSecond=${filtro.aSecond}`;
  if (filtro.aCondition) query += `&aCondition=${filtro.aCondition}`;

  return api.get(`/stock?perPage=${perPage}&page=${page}${query}`);
};

export const useStockData = ({
  onError,
  filter,
  page,
  perPage,
  enabled,
  select,
}: any) => {
  return useQuery(
    ['stocks', page, perPage, filter],
    () => fetchStock(filter, page, perPage),
    {
      onError,
      enabled,
      select,
    },
  );
};
