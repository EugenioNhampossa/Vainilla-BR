import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';

const addMarca = (marca: any) => {
  return api.post('/marcas', marca);
};

export const useAddMarcaData = () => {
  const queryClient = useQueryClient();
  return useMutation(addMarca, {
    onSuccess: (data: any) => {
      const marcas = queryClient.getQueryData('marcas');
      if (marcas) {
        queryClient.setQueryData('marcas', (oldQueryData: any) => {
          return {
            ...oldQueryData,
            data: [...oldQueryData.data, data.data],
          };
        });
      }
    },
  });
};
