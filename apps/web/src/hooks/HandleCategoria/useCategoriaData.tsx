import { useInfiniteQuery, useQuery, useQueryClient } from 'react-query';
import { api } from '../../Shared/api';
import { notify } from '../../Components/Modals/Notification';

interface ICategoriaFilterProps {
  titulo?: string | undefined;
  codigo?: string | undefined;
}

const fetchCategorias = (
  { titulo, codigo }: ICategoriaFilterProps,
  page: number,
  perPage: number,
) => {
  let query = '';
  if (titulo) query += `&titulo=${titulo}`;
  if (codigo) query += `&codigo=${codigo}`;
  return api.get(`/categorias?perPage=${perPage}&page=${page}${query}`);
};

export const useCategoriasData = ({ filter, page, perPage, select }: any) => {
  return useQuery(
    ['categorias', page, perPage, filter],
    () => fetchCategorias(filter, page, perPage),
    {
      select,
      onError: (error) => {
        notify({
          data: error,
          title: 'Falha na Busca das Categorias',
          type: 'error',
        });
      },
    },
  );
};
