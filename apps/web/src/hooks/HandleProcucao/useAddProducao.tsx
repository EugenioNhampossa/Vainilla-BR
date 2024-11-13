import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';

const addProducao = (producao: any) => {
  return api.post('/producao', producao);
};

export const useAddProducao = () => {
  const queryClient = useQueryClient();
  return useMutation(addProducao, {
    onSuccess: (data: any) => {
      const compras = queryClient.getQueryData('producao');
      if (compras) {
        queryClient.setQueryData('producao', (oldQueryData: any) => {
          return {
            ...oldQueryData,
            data: [...oldQueryData.data, data.data],
          };
        });
      }
    },
  });
};
