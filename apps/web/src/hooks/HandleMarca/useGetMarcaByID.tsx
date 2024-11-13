import { useQuery, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';

const fetchMarcaById = (id: string) => {
  return api.get(`/marcas/${id}`);
};

export const usefetchMarcaByID = (id: string, onError: any) => {
  const queryClient: any = useQueryClient();
  return useQuery(['marca', id], () => fetchMarcaById(id), {
    onError,
    initialData: () => {
      const marca = queryClient
        .getQueryData('marcas')
        ?.data?.find((marca: any) => marca.id === id);
      if (marca) {
        return { data: marca };
      } else {
        return undefined;
      }
    },
  });
};
