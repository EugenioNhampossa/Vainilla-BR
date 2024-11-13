import { useQuery } from 'react-query';
import { api } from '../../Shared/api';

interface IStockFilterProps {
  id_artigo?: string | undefined;
  id_instalacao?: string | undefined;
}

const fetchStock = (filtro: IStockFilterProps) => {
  let query = '';
  if (filtro.id_artigo) query += `&id_artigo=${filtro.id_artigo}`;
  if (filtro.id_instalacao) query += `&id_instalacao=${filtro.id_instalacao}`;

  if (filtro.id_instalacao) return api.get(`/stock/artigo?${query}`);
};

export const useGetStockByArtigo = ({
  onError,
  filter,
  enabled,
  select,
}: any) => {
  return useQuery(['stock_artigo', filter], () => fetchStock(filter), {
    onError,
    enabled,
    select,
  });
};
