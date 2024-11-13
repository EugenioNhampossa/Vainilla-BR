import { useQuery } from 'react-query';
import { api } from '../../Shared/api';

interface IFornecedorFilterProps {
  nuit?: string | undefined;
  nome?: string | undefined;
  email?: string | undefined;
}

const fetchFornecedores = (
  { nuit, nome, email }: IFornecedorFilterProps,
  page: number,
  perPage: number,
) => {
  let query = '';
  if (nuit) query += `&nuit=${nuit}`;
  if (nome) query += `&nome=${nome}`;
  if (email) query += `&email=${email}`;
  return api.get(`/fornecedores?perPage=${perPage}&page=${page}${query}`);
};

export const useFornecedoresData = ({
  onError,
  filter,
  page,
  perPage,
  select,
  enabled,
}: any) => {
  return useQuery(
    ['fornecedores', page, perPage, filter],
    () => fetchFornecedores(filter, page, perPage),
    {
      onError,
      select,
      enabled,
    },
  );
};
