import { useQuery, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';

interface IItensTransFilterProps {
  id_artigo?: string | undefined;
  firstValue: string | undefined;
  condition: 'gte' | 'lte' | 'equals' | 'between';
  secondValue?: string | undefined;
}

const fetchItensTrans = (
  { id_artigo, firstValue, condition, secondValue }: IItensTransFilterProps,
  page: number,
  perPage: number,
  id_transferecia: string,
) => {
  let query = '';
  if (id_artigo) query += `&id_artigo=${id_artigo}`;
  if (firstValue) query += `&firstValue=${firstValue}`;
  if (condition) query += `&condition=${condition}`;
  if (secondValue) query += `&secondValue=${secondValue}`;
  if (!id_transferecia) id_transferecia = 'undefined';

  return api.get(
    `/itens-transferencia/${id_transferecia}?perPage=${perPage}&page=${page}${query}`,
  );
};

export const useItensTransData = ({
  onError,
  filter,
  page,
  perPage,
  enabled,
  select,
  idFilter: id_transferecia,
}: any) => {
  return useQuery(
    ['itens-transferencia', page, perPage, filter],
    () => fetchItensTrans(filter, page, perPage, id_transferecia),
    {
      onError,
      enabled,
      select,
    },
  );
};
