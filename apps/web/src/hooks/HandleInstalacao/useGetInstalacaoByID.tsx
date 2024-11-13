import { useQuery, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';
import { notify } from '../../Components/Modals/Notification';

const fetchInstalacaoById = (id: string) => {
  return api.get(`/instalacoes/${id}`);
};

export const usefetchInstalacaoByID = (id: string) => {
  const queryClient: any = useQueryClient();
  return useQuery(['instalacao', id], () => fetchInstalacaoById(id), {
    enabled: !!id,
    onError: (error) => {
      notify({
        data: error,
        title: 'Erro na busca da instalação',
        type: 'error',
      });
    },
    initialData: () => {
      const instalacao = queryClient
        .getQueryData('instalacoes')
        ?.data?.find((instalacao: any) => instalacao.id === id);

      if (instalacao) {
        return { data: instalacao };
      } else {
        return undefined;
      }
    },
  });
};
