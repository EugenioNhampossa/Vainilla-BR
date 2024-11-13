import { useQuery, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';

interface ITransFilterProps {
  id_estPartida?: string | undefined;
  id_estDestino?: string | undefined;
  firstDate: Date | undefined;
  condition: 'gte' | 'lte' | 'equals' | 'between';
  secondDate?: Date | undefined;
}

const fetchTransferencias = (
  {
    id_estPartida,
    id_estDestino,
    condition,
    firstDate,
    secondDate,
  }: ITransFilterProps,
  page: number,
  perPage: number,
) => {
  let query = '';
  if (id_estPartida) query += `&id_estPartida=${id_estPartida}`;
  if (id_estDestino) query += `&id_estDestino=${id_estDestino}`;
  if (condition) query += `&condition=${condition}`;
  if (firstDate) query += `&firstDate=${firstDate}`;
  if (secondDate) query += `&secondDate=${secondDate}`;
  return api.get(`/transferencias?perPage=${perPage}&page=${page}${query}`);
};

export const useTransData = ({
  onError,
  filter,
  page,
  perPage,
  enabled,
  select,
}: any) => {
  return useQuery(
    ['transferencias', page, perPage, filter],
    () => fetchTransferencias(filter, page, perPage),
    {
      onError,
      enabled,
      select,
    },
  );
};
