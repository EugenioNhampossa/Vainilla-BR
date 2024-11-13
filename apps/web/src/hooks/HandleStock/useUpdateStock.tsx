import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';

const updateStock = (stock: any) => {
  return api.patch(`/stock/${stock.id}`, stock);
};

export const useUpdateStockData = () => {
  const queryClient = useQueryClient();
  return useMutation(updateStock, {
    onMutate: () => {
      queryClient.invalidateQueries(['stock']);
    },
  });
};
