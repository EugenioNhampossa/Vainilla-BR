import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';
import { notify } from '../../Components/Modals/Notification';

const addCaixa = (caixa: any) => {
  return api.post('/caixas', caixa);
};

export const useAddCaixaData = () => {
  const queryClient = useQueryClient();
  return useMutation(addCaixa, {
    onSuccess: (data: any) => {
      const caixas = queryClient.getQueryData('caixas');
      if (caixas) {
        queryClient.setQueryData('caixas', (oldQueryData: any) => {
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
        title: 'Erro no registro do caixa',
        type: 'error',
      });
    },
  });
};
