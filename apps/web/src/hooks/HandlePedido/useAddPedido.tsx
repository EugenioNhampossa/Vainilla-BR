import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';
import { notify } from '../../Components/Modals/Notification';

const addPedido = (pedidos: any) => {
  return api.post('/pedidos', pedidos, {});
};

export const useAddPedidoData = () => {
  const queryClient = useQueryClient();
  return useMutation(addPedido, {
    onSuccess: (data: any) => {
      notify({
        message: 'Pedido Registrado',
        title: 'Sucesso',
        type: 'success',
      });
      const pedidos = queryClient.getQueryData('pedidos');
      if (pedidos) {
        queryClient.setQueryData('pedidos', (oldQueryData: any) => {
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
        title: 'Erro no Registro do Artigo',
        type: 'error',
      });
    },
  });
};
