import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';

const addStock = (stock: any) => {
  return api.post('/stock', stock);
};

export const useAddStockData = () => {
  const queryClient = useQueryClient();
  return useMutation(addStock, {
    onMutate: (data: any) => {
      const stock = queryClient.getQueryData('stock');
      if (stock) {
        queryClient.setQueryData('stock', (oldQueryData: any) => {
          return {
            ...oldQueryData,
            data: [...oldQueryData.data, data.data],
          };
        });
      }
    },
  });
};
