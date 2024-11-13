import { useQuery } from 'react-query';
import { api } from '../../Shared/api';

const fetchSubFamiliaById = (id: string) => {
  return api.get(`/subfamilias/${id}`);
};

export const usefetchSubFamiliaByID = (id: string, onError: any) => {
  return useQuery(['subfamilia', id], () => fetchSubFamiliaById(id), {
    onError,
  });
};
