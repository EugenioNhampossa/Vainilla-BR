import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';
import { notify } from '../../Components/Modals/Notification';

const updateCaixa = (caixa: any) => {
  return api.patch(`/caixas/${caixa.id}`, caixa);
};

export const useUpdateCaixaData = () => {
  const queryClient = useQueryClient();
  return useMutation(updateCaixa, {
    onMutate: () => {
      queryClient.invalidateQueries({ queryKey: ['caixas'] });
    },
  });
};

const openSession = (caixa: any) => {
  return api.post(`/caixas/sessao/abrir/`, caixa);
};

export const useOpenSession = () => {
  const queryClient = useQueryClient();
  return useMutation(openSession, {
    onMutate: () => {
      queryClient.invalidateQueries({ queryKey: ['caixas'] });
    },
    onError: (error) => {
      notify({
        data: error,
        title: 'Erro ao abrir o caixa',
        type: 'error',
      });
    },
  });
};

const closeSession = ({ id, closeSessionData }: any) => {
  return api.patch(`/caixas/sessao/fechar/${id}`, closeSessionData);
};

export const useCloseSession = () => {
  const queryClient = useQueryClient();
  return useMutation(closeSession, {
    onMutate: () => {
      queryClient.invalidateQueries({ queryKey: ['caixas'] });
    },
    onError: (error) => {
      notify({
        data: error,
        title: 'Erro ao fechar o caixa',
        type: 'error',
      });
    },
  });
};
