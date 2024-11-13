import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';
import { notify } from '../../Components/Modals/Notification';

const updateInstalacao = (instalacao: any) => {
  return api.patch(`/instalacoes/${instalacao.id}`, instalacao);
};

export const useUpdateInstalacaoData = () => {
  const queryClient = useQueryClient();
  return useMutation(updateInstalacao, {
    onMutate: () => {
      queryClient.invalidateQueries(['instalacoes']);
    },
    onError: (error) => {
      notify({
        data: error,
        title: 'Erro no registro da instalação',
        type: 'error',
      });
    },
    onSuccess: () => {
      notify({
        message: 'Instalação actualizada',
        title: 'Sucesso',
        type: 'success',
      });
    },
  });
};
