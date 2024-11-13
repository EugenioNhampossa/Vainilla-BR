import { useQuery, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';
import { notify } from '../../Components/Modals/Notification';

interface IProdutoFilterProps {
  isCombo?: boolean | undefined;
  id_categoria?: string | undefined;
  codigo?: string | undefined;
  titulo?: string | undefined;
}

const fetchProdutos = (
  { isCombo, id_categoria, codigo, titulo }: IProdutoFilterProps,
  page: number,
  perPage: number,
) => {
  let query = '';
  if (isCombo) query += `&isCombo=${isCombo}`;
  if (codigo) query += `&codigo=${codigo}`;
  if (titulo) query += `&titulo=${titulo}`;
  if (id_categoria) query += `&id_categoria=${id_categoria}`;
  return api.get(`/produtos?perPage=${perPage}&page=${page}${query}`);
};

export const useProdutosData = ({ filter, page, perPage }: any) => {
  return useQuery(
    ['produtos', page, perPage, filter],
    () => fetchProdutos(filter, page, perPage),
    {
      onError: (error) => {
        notify({
          data: error,
          title: 'Erro na busca dos produtos',
          type: 'error',
        });
      },
    },
  );
};

export const useSelectProdutos = ({ titulo }: { titulo?: string }) => {
  return useQuery(
    ['produtos', 'select'],
    () => fetchProdutos({ titulo }, 1, 30),
    {
      select: (response) => {
        return response.data.data.map((produto: any) => {
          return { label: produto.titulo, value: produto.id };
        });
      },
      onError: (error) => {
        notify({
          data: error,
          title: 'Erro na busca dos produtos',
          type: 'error',
        });
      },
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
