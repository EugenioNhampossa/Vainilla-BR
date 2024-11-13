import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import { api } from '../../Shared/api';
import { notify } from '../../Components/Modals/Notification';
import { useAuth0 } from '@auth0/auth0-react';

interface IUsuariosFilterProps {
  name?: string | undefined;
  email?: string | undefined;
}

const fetchUsuarios = (
  { name, email }: IUsuariosFilterProps,
  page: number,
  perPage: number,
) => {
  let query = '';
  if (name) query += `&name=${name}`;
  if (email) query += `&email=${email}`;
  return api.get(`/users?perPage=${perPage}&page=${page}${query}`);
};

export const useUsuariosData = ({ filter, select }: any) => {
  return useQuery(['usuarios', filter], () => fetchUsuarios(filter, 0, 50), {
    select,
    onError: (error) => {
      notify({
        data: error,
        title: 'Falha na Busca dos usuarios',
        type: 'error',
      });
    },
  });
};

const addUsuario = (usuario: any) => {
  return api.post('/users', usuario);
};

export const useAddUsuarios = () => {
  const queryClient = useQueryClient();
  return useMutation(addUsuario, {
    onSuccess: (data: any) => {
      const usuarios = queryClient.getQueryData('usuarios');
      if (usuarios) {
        queryClient.setQueryData('usuarios', (oldQueryData: any) => {
          return {
            ...oldQueryData,
            data: [...oldQueryData.data, data.data],
          };
        });
      }
    },
  });
};

const fetchRoles = () => {
  return api.get(`/users/roles`);
};

export const useRolesData = () => {
  return useQuery(['usuarios/roles'], () => fetchRoles(), {
    select: ({ data }) => {
      return data.map((role: any) => {
        return { value: role.id, label: role.name };
      });
    },
    onError: (error) => {
      notify({
        data: error,
        title: 'Falha na Busca das funções',
        type: 'error',
      });
    },
  });
};

const getUsuarios = () => {
  return api.get(`/users?perPage=${50}&page=${0}`);
};

interface Usuario {
  email: string;
  name: string;
  user_metadata: {
    id_instalacao: string;
  };
}

interface SelectOption {
  value: string;
  label: string;
}

export const useSelectUsuarios = () => {
  const { user } = useAuth0();

  return useQuery(['usuarios', 'select'], () => getUsuarios(), {
    onError: (error) => {
      notify({
        data: error,
        title: 'Falha na Busca dos usuários',
        type: 'error',
      });
    },
    select: ({ data }: { data: Usuario[] }): SelectOption[] => {
      return data
        .map((usuario) => {
          if (user?.id_instalacao === usuario.user_metadata.id_instalacao) {
            return { value: usuario.email, label: usuario.name };
          }
          return null;
        })
        .filter((option): option is SelectOption => option !== null);
    },
  });
};
