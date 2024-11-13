import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';
import { notify } from '../../Components/Modals/Notification';

const addSaidaStock = (saidaStock: any) => {
  return api.post('/saidas-stock', saidaStock);
};

export const useAddSaidaStock = () => {
  const queryClient = useQueryClient();
  return useMutation(addSaidaStock, {
    onSuccess: (data: any) => {
      notify({
        message: 'Saída de stock registrada',
        title: 'Sucesso',
        type: 'success',
      });
      const saidas = queryClient.getQueryData('saidas');
      if (saidas) {
        queryClient.setQueryData('saidas', (oldQueryData: any) => {
          return {
            ...oldQueryData,
            data: [...oldQueryData.data, data.data],
          };
        });
      }
    },
    onError: (error) => {
      notify({
        data: error,
        title: 'Erro no registro da saída de stock',
        type: 'error',
      });
    },
  });
};
