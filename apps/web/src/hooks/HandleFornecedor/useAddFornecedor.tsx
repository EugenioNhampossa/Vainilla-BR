import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';

const addFornecedor = (fornecedor: any) => {
  return api.post('/fornecedores', fornecedor);
};

export const useAddFornecedorData = () => {
  const queryClient = useQueryClient();
  return useMutation(addFornecedor, {
    onSuccess: (data: any) => {
      const fornecedor = queryClient.getQueryData('fornecedores');
      if (fornecedor) {
        queryClient.setQueryData('fornecedores', (oldQueryData: any) => {
          return {
            ...oldQueryData,
            data: [...oldQueryData.data, data.data],
          };
        });
      }
    },
  });
};
