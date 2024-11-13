import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';

const addCompra = (compra: any) => {
  return api.post('/compras', compra);
};

export const useAddCompraData = () => {
  const queryClient = useQueryClient();
  return useMutation(addCompra, {
    onSuccess: (data: any) => {
      const compras = queryClient.getQueryData('compras');
      if (compras) {
        queryClient.setQueryData('compras', (oldQueryData: any) => {
          return {
            ...oldQueryData,
            data: [...oldQueryData.data, data.data],
          };
        });
      }
    },
  });
};
