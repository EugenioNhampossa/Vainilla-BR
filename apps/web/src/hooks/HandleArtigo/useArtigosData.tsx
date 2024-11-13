import { useQuery } from 'react-query';
import { api } from '../../Shared/api';
import { notify } from '../../Components/Modals/Notification';

interface IArtigosProps {
  codigo?: string | undefined;
  titulo?: string | undefined;
  id_marca?: string | undefined;
  id_familia?: string | undefined;
  id_subfamilia?: string | undefined;
}

const fetchArtigos = (filtro: IArtigosProps, page: number, perPage: number) => {
  let query = '';
  if (filtro.titulo) query += `&titulo=${filtro.titulo}`;
  if (filtro.codigo) query += `&codigo=${filtro.codigo}`;
  if (filtro.id_marca) query += `&id_marca=${filtro.id_marca}`;
  if (filtro.id_familia) query += `&id_familia=${filtro.id_familia}`;
  if (filtro.id_subfamilia) query += `&id_subfamilia=${filtro.id_subfamilia}`;

  return api.get(`/artigos?perPage=${perPage}&page=${page}${query}`);
};

export const useArtigosData = ({ filter, page, perPage, select }: any) => {
  return useQuery(
    ['artigos', page, perPage, filter],
    () => fetchArtigos(filter, page, perPage),
    {
      onError: (error) => {
        notify({
          data: error,
          title: 'Erro no Registro do Artigo',
          type: 'error',
        });
      },
      select,
    },
  );
};

export const useSelectArtigos = ({ titulo }: { titulo?: string }) => {
  return useQuery(
    ['artigos', 'select'],
    () => fetchArtigos({ titulo }, 1, 30),
    {
      select: (response) => {
        return response.data.data.map((artigo: any) => {
          return { label: artigo.titulo, value: artigo.id };
        });
      },
      onError: (error) => {
        notify({
          data: error,
          title: 'Erro na busca dos artigos',
          type: 'error',
        });
      },
    },
  );
};

const fetchAllItems = () => {
  return api.get(`/artigos/todos`);
};

export const useGetAllItems = () => {
  return useQuery(['artigos', 'todos'], () => fetchAllItems(), {
    onError: (error) => {
      notify({
        data: error,
        title: 'Erro na busca dos artigos',
        type: 'error',
      });
    },
  });
};

