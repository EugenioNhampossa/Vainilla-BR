import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';

const updateFornecedor = (fornecedor: any) => {
  return api.patch(`/fornecedores/${fornecedor.id}`, fornecedor);
};

export const useUpdateFornecedorData = () => {
  const queryClient = useQueryClient();
  return useMutation(updateFornecedor, {
    onMutate: () => {
      queryClient.invalidateQueries(['fornecedores']);
    },
  });
};
