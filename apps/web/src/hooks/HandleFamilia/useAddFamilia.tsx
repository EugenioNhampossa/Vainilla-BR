import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';

const addFamilia = (familia: any) => {
  return api.post('/familias', familia);
};

export const useAddFamiliaData = () => {
  const queryClient = useQueryClient();
  return useMutation(addFamilia, {
    onMutate: (data: any) => {
      const familias = queryClient.getQueryData('familias');
      if (familias) {
        queryClient.setQueryData('familias', (oldQueryData: any) => {
          return {
            ...oldQueryData,
            data: [...oldQueryData.data, data.data],
          };
        });
      }
    },
  });
};
