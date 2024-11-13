import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';

const addCategoria = (categoria: any) => {
  return api.post('/categorias', categoria);
};

export const useAddCategoriaData = () => {
  const queryClient = useQueryClient();
  return useMutation(addCategoria, {
    onSuccess: (data: any) => {
      const categorias = queryClient.getQueryData('categorias');
      if (categorias) {
        queryClient.setQueryData('categorias', (oldQueryData: any) => {
          return {
            ...oldQueryData,
            data: [...oldQueryData.data, data.data],
          };
        });
      }
    },
  });
};
