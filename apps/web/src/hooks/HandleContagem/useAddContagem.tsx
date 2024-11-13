import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';
import { notify } from '../../Components/Modals/Notification';

const addContagem = (contagem: any) => {
  return api.post('/contagens', contagem);
};

export const useAddContagem = () => {
  const queryClient = useQueryClient();
  return useMutation(addContagem, {
    onSuccess: (data: any) => {
      notify({
        message: 'Contagem Registrada',
        title: 'Sucesso',
        type: 'success',
      });
      const contagens = queryClient.getQueryData('contagens');
      if (contagens) {
        queryClient.setQueryData('contagens', (oldQueryData: any) => {
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
        title: 'Erro no registro da contagem',
        type: 'error',
      });
    },
  });
};
