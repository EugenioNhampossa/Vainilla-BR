import { useQuery, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';
import { notify } from '../../Components/Modals/Notification';

interface IProdutoFilterProps {
  codigo?: string | undefined;
  titulo?: string | undefined;
}

const fetchProducao = (
  { codigo, titulo }: IProdutoFilterProps,
  page: number,
  perPage: number,
) => {
  let query = '';
  if (codigo) query += `&codigo=${codigo}`;
  if (titulo) query += `&titulo=${titulo}`;
  return api.get(`/producao?perPage=${perPage}&page=${page}${query}`);
};

export const useProducaoData = ({ onError, filter, page, perPage }: any) => {
  return useQuery(
    ['producao', page, perPage, filter],
    () => fetchProducao(filter, page, perPage),
    {
      onError,
    },
  );
};

const fetchProdutoById = (id: string) => {
  return api.get(`/produtos/${id}`);
};

export const usefetchProdutoByID = (id: string) => {
  return useQuery(['produtos', id], () => fetchProdutoById(id), {
    onError: (error) => {
      notify({
        data: error,
        title: 'Erro na busca dos dados do produto',
        type: 'error',
      });
    },
  });
};
