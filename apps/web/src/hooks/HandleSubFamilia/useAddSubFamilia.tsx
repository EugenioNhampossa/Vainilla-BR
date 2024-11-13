import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';

const addSubFamilia = (subFamilia: any) => {
  return api.post('/subfamilias', subFamilia);
};

export const useAddSubFamiliaData = (idfamilia: string) => {
  const queryClient = useQueryClient();
  return useMutation(addSubFamilia, {
    onMutate: () => {
      queryClient.invalidateQueries(['subfamilias', idfamilia]);
    },
  });
};
