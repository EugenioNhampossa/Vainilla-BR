import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';
import { notify } from '../../Components/Modals/Notification';

const addEntradaStock = (entradaStock: any) => {
  return api.post('/entradas-stock', entradaStock);
};

export const useAddEntradaStock = () => {
  const queryClient = useQueryClient();
  return useMutation(addEntradaStock, {
    onSuccess: (data: any) => {
      notify({
        message: 'Entrada de stock registrada',
        title: 'Sucesso',
        type: 'success',
      });
      const Entradas = queryClient.getQueryData('entradas');
      if (Entradas) {
        queryClient.setQueryData('entradas', (oldQueryData: any) => {
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
        title: 'Erro no registro da entrada de stock',
        type: 'error',
      });
    },
  });
};
