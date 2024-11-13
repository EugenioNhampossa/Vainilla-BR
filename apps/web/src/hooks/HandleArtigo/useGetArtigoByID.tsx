import { useQuery } from 'react-query';
import { api } from '../../Shared/api';

const fetchArtigoById = (id: string) => {
  return api.get(`/artigos/${id}`);
};

export const usefetchArtigoByID = (id: string, onError: any) => {
  return useQuery(['artigo', id], () => fetchArtigoById(id), {
    onError,
  });
};
