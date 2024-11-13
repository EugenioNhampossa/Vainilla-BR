import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';
import { notify } from '../../Components/Modals/Notification';

const addInstalacao = (instalacao: any) => {
  return api.post('/instalacoes', instalacao);
};

export const useAddInstalacaoData = () => {
  const queryClient = useQueryClient();
  return useMutation(addInstalacao, {
    onError: (error) => {
      notify({
        data: error,
        title: 'Erro no registro da instalação',
        type: 'error',
      });
    },
    onSuccess: () => {
      notify({
        message: 'Instalação registrada',
        title: 'Sucesso',
        type: 'success',
      });
    },
    onMutate: (data: any) => {
      const instalacoes = queryClient.getQueryData('instalacoes');
      if (instalacoes) {
        queryClient.setQueryData('instalacoes', (oldQueryData: any) => {
          return {
            ...oldQueryData,
            data: [...oldQueryData.data, data.data],
          };
        });
      }
    },
  });
};
