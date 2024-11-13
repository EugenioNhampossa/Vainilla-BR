import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';

const addCliente = (cliente: any) => {
  return api.post('/clientes', cliente);
};

export const useAddClienteData = () => {
  const queryClient = useQueryClient();
  return useMutation(addCliente, {
    onSuccess: (data: any) => {
      const clientes = queryClient.getQueryData('clientes');
      if (clientes) {
        queryClient.setQueryData('clientes', (oldQueryData: any) => {
          return {
            ...oldQueryData,
            data: [...oldQueryData.data, data.data],
          };
        });
      }
    },
  });
};
