import { useMutation } from 'react-query';
import { api } from '../../Shared/api';
import { notify } from '../../Components/Modals/Notification';

const update = (data: any) => {
  return api.patch(`/pedidos/${data.id}`, data);
};

export const useUpdatePedido = () => {
  return useMutation(update, {
    onSuccess: () => {
      notify({
        message: 'Pedido Registrado',
        title: 'Sucesso',
        type: 'success',
      });
    },
    onError: (error) => {
      notify({
        data: error,
        title: 'Erro no Registro do Pedido',
        type: 'error',
      });
    },
  });
};

export const useRemoveOrder = () => {
  return useMutation(
    (id: string) => {
      return api.delete(`/pedidos/${id}`);
    },
    {
      onSuccess: () => {
        notify({
          message: 'Pedido removido',
          title: 'Sucesso',
          type: 'success',
        });
      },
      onError: (error) => {
        notify({
          data: error,
          title: 'Erro na remoção do Pedido',
          type: 'error',
        });
      },
    },
  );
};
