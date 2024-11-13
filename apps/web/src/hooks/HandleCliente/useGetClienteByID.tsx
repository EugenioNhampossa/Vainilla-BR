import { useQuery } from 'react-query';
import { api } from '../../Shared/api';

const fetchClienteById = (id: string) => {
  return api.get(`/clientes/${id}`);
};

export const usefetchClienteByID = (id: string, onError: any) => {
  return useQuery(['cliente', id], () => fetchClienteById(id), {
    onError,
  });
};
