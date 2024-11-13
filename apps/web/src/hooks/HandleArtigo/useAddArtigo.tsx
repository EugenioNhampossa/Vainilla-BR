import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';
import { notify } from '../../Components/Modals/Notification';

const addArtigo = (artigo: any) => {
  return api.post('/artigos', artigo);
};

export const useAddArtigoData = () => {
  const queryClient = useQueryClient();
  return useMutation(addArtigo, {
    onSuccess: (data: any) => {
      notify({
        message: 'Artigo Registrado',
        title: 'Sucesso',
        type: 'success',
      });
      const artigos = queryClient.getQueryData('artigos');
      if (artigos) {
        queryClient.setQueryData('artigos', (oldQueryData: any) => {
          return {
            ...oldQueryData,
            data: [...oldQueryData.data, data.data],
          };
        });
      }
    },
    onError: (error) => {
      notify({
        data: error,
        title: 'Erro no Registro do Artigo',
        type: 'error',
      });
    },
  });
};
