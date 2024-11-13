import { useQuery } from 'react-query';
import { api } from '../../Shared/api';

const fetchFornecedorById = (id: string) => {
  return api.get(`/fornecedores/${id}`);
};

export const usefetchFornecedorByID = (id: string, onError: any) => {
  return useQuery(['fornecedores', id], () => fetchFornecedorById(id), {
    onError,
  });
};
