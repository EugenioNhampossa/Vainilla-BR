import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';

const addTransferencia = (transferencia: any) => {
  return api.post('/transferencias', transferencia);
};

export const useAddTransData = () => {
  const queryClient = useQueryClient();
  return useMutation(addTransferencia, {
    onSuccess: (data: any) => {
      const transferencias = queryClient.getQueryData('transferencias');
      if (transferencias) {
        queryClient.setQueryData('transferencias', (oldQueryData: any) => {
          return {
            ...oldQueryData,
            data: [...oldQueryData.data, data.data],
          };
        });
      }
    },
  });
};
