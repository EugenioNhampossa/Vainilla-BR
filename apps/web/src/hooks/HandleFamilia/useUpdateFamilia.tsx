import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';

const updateFamilia = (familia: any) => {
  return api.patch(`/familias/${familia.id}`, familia);
};

export const useUpdateFamiliaData = () => {
  const queryClient = useQueryClient();
  return useMutation(updateFamilia, {
    onMutate: () => {
      queryClient.invalidateQueries(['familias']);
    },
  });
};
