import { useQuery } from 'react-query';
import { api } from '../../Shared/api';

const fetchTransById = (id: string) => {
  return api.get(`/transferencias/${id}`);
};

export const usefetchTransByID = (id: string, onError: any) => {
  return useQuery(['transferencia', id], () => fetchTransById(id), {
    onError,
  });
};
