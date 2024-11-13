import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';

const updateArtigo = (artigo: any) => {
  return api.patch(`/artigos/${artigo.id}`, artigo);
};

export const useUpdateArtigoData = () => {
  const queryClient = useQueryClient();
  return useMutation(updateArtigo, {
    onMutate: () => {
      queryClient.invalidateQueries(['artigos']);
    },
  });
};
