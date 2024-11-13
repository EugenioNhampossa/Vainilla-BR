import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';

const updateProdutosSimples = (produto: any) => {
  console.log(produto);
  
  return api.patch(`/produtos/${produto.id}`, produto);
};

export const useUpdateProdutoSimples = () => {
  const queryClient = useQueryClient();
  return useMutation(updateProdutosSimples, {
    onMutate: () => {
      queryClient.invalidateQueries(['produtos']);
    },
  });
};

const updateCombo = (produto: any) => {
  return api.patch(`/produtos/combo/${produto.id}`, produto);
};

export const useUpdateCombo = () => {
  const queryClient = useQueryClient();
  return useMutation(updateCombo, {
    onMutate: () => {
      queryClient.invalidateQueries(['produtos']);
    },
  });
};
