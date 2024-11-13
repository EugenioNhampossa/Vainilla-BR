import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';

const updateMarca = (marca: any) => {
  return api.patch(`/marcas/${marca.id}`, marca);
};

export const useUpdateMarcaData = () => {
  const queryClient = useQueryClient();
  return useMutation(updateMarca, {
    onMutate: () => {
      queryClient.invalidateQueries(['marcas']);
    },
  });
};
