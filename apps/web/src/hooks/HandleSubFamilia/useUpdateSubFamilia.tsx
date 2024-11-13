import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';

const updateSubFamilia = (subfamilia: any) => {
  return api.patch(`/subfamilias/${subfamilia.id}`, subfamilia);
};

export const useUpdateSubFamiliaData = (idfamilia: string) => {
  const queryClient = useQueryClient();
  return useMutation(updateSubFamilia, {
    onMutate: () => {
      queryClient.invalidateQueries(['subfamilias', idfamilia]);
    },
  });
};
