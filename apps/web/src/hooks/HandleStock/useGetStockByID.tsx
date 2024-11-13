import { useQuery, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';

const fetchStockById = (id: string) => {
  return api.get(`/stock/${id}`);
};

export const usefetchStockByID = (id: string, onError: any) => {
  const queryClient: any = useQueryClient();
  return useQuery(['stock', id], () => fetchStockById(id), {
    onError,
    initialData: () => {
      const stock = queryClient
        .getQueryData('stock')
        ?.data?.find((stock: any) => stock.id === id);
      if (stock) {
        return { data: stock };
      } else {
        return undefined;
      }
    },
  });
};
