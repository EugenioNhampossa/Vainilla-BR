import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';

const addProdutosSimples = (produto: any) => {
  return api.post('/produtos', produto);
};

export const useAddProdutoSimplesData = () => {
  const queryClient = useQueryClient();
  return useMutation(addProdutosSimples, {
    onSuccess: (data: any) => {
      const produtos = queryClient.getQueryData('produtos');
      if (produtos) {
        queryClient.setQueryData('produtos', (oldQueryData: any) => {
          return {
            ...oldQueryData,
            data: [...oldQueryData.data, data.data],
          };
        });
      }
    },
  });
};

const addCombo = (produto: any) => {
  return api.post('/produtos/combo', produto);
};

export const useAddCombo = () => {
  const queryClient = useQueryClient();
  return useMutation(addCombo, {
    onSuccess: (data: any) => {
      const produtos = queryClient.getQueryData('produtos');
      if (produtos) {
        queryClient.setQueryData('produtos', (oldQueryData: any) => {
          return {
            ...oldQueryData,
            data: [...oldQueryData.data, data.data],
          };
        });
      }
    },
  });
};
