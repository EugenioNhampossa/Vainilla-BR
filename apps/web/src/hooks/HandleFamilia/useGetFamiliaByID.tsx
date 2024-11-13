import { useQuery, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';

const fetchFamiliaById = (id: string) => {
  return api.get(`/familias/${id}`);
};

export const usefetchFamiliaByID = (id: string, onError: any) => {
  const queryClient: any = useQueryClient();
  return useQuery(['familia', id], () => fetchFamiliaById(id), {
    onError,
    initialData: () => {
      const familia = queryClient
        .getQueryData('familias')
        ?.data?.find((familia: any) => familia.id === id);

      if (familia) {
        return { data: familia };
      } else {
        return undefined;
      }
    },
  });
};
