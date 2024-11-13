import { useQuery, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';

interface IInstalacaoFilterProps {
  titulo?: string | undefined;
  codigo?: string | undefined;
  tipo?: string | undefined;
}

const fetchInstalacoes = (
  { titulo, codigo, tipo }: IInstalacaoFilterProps,
  page: number,
  perPage: number,
) => {
  let query = '';
  if (titulo) query += `&titulo=${titulo}`;
  if (codigo) query += `&codigo=${codigo}`;
  if (tipo) query += `&tipo=${tipo}`;
  return api.get(`/instalacoes?perPage=${perPage}&page=${page}${query}`);
};

export const useInstalacoesData = ({
  onError,
  filter,
  page,
  perPage,
  enabled,
  select,
}: any) => {
  return useQuery(
    ['instalacoes', page, perPage, filter],
    () => fetchInstalacoes(filter, page, perPage),
    {
      onError,
      enabled,
      select,
    },
  );
};
