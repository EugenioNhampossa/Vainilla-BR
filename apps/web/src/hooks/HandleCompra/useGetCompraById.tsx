import { useQuery } from 'react-query';
import { api } from '../../Shared/api';
import { notify } from '../../Components/Modals/Notification';

const fetchCompraById = (id: string) => {
  return api.get(`/compras/${id}`);
};

export const usefetchCompraByID = (id: string) => {
  return useQuery(['compra', id], () => fetchCompraById(id), {
    onError: (error) => {
      notify({
        data: error,
        title: 'Erro na busca das compras',
        type: 'error',
      });
    },
  });
};
