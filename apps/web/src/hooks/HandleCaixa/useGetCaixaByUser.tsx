import { useQuery } from 'react-query';
import { api } from '../../Shared/api';
import { notify } from '../../Components/Modals/Notification';

const fetchCaixaByUser = (email: string | undefined) => {
  return api.get(`/caixas/${email}`);
};

export const useGetCaixa = (email?: string) => {
  return useQuery(['caixa', email], () => fetchCaixaByUser(email), {
    enabled: !!email,
    onError: (error) => {
      notify({
        data: error,
        title: 'Erro na busca dos dados do caixa',
        type: 'error',
      });
    },
  });
};
