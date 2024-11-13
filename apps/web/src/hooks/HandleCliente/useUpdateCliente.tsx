import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';

const updateCliente = (cliente: any) => {
  return api.patch(`/clientes/${cliente.id}`, cliente);
};

export const useUpdateClienteData = () => {
  const queryClient = useQueryClient();
  return useMutation(updateCliente, {
    onMutate: () => {
      queryClient.invalidateQueries(['clientes']);
    },
  });
};
