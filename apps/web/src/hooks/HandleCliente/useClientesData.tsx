import { useQuery } from 'react-query';
import { api } from '../../Shared/api';

interface IClienteFilterProps {
  nuit?: string | undefined;
  nome?: string | undefined;
  email?: string | undefined;
}

const fetchClientes = (
  { nuit, nome, email }: IClienteFilterProps,
  page: number,
  perPage: number,
) => {
  let query = '';
  if (nuit) query += `&nuit=${nuit}`;
  if (nome) query += `&nome=${nome}`;
  if (email) query += `&email=${email}`;
  return api.get(`/clientes?perPage=${perPage}&page=${page}${query}`);
};

export const useClientesData = ({ onError, filter, page, perPage }: any) => {
  return useQuery(
    ['clientes', page, perPage, filter],
    () => fetchClientes(filter, page, perPage),
    {
      onError,
    },
  );
};
