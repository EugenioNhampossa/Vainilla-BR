import { Box, Button, Paper, TextInput, Text } from '@mantine/core';
import { AvatarMenu } from '../../Components/AvatarMenu';
import { Link } from 'react-router-dom';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import {
  IconExclamationCircle,
  IconHash,
  IconPlus,
  IconTag,
} from '@tabler/icons';
import { useRef, useState } from 'react';
import { useProducaoData } from '../../hooks/HandleProcucao/useProducaoData';
import { useDebouncedState } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { Tabela } from '../../Components/Tabela/Tabela';
import { MenuCaixa } from '../../Components/MenuCaixa';

const columns: DataTableColumn<any>[] = [
  {
    accessor: 'Produto.codigo',
    title: 'Código',
  },
  {
    accessor: 'Produto.titulo',
    title: 'Título',
  },
  {
    accessor: 'Instalacao.titulo',
    title: 'Instalação',
  },
  {
    accessor: 'actual',
    title: 'Quantidade',
  },
  {
    accessor: 'dataActualizacao',
    title: 'Ultima Actualizacao',
    render: ({ dataActualizacao }) =>
      new Date(dataActualizacao).toLocaleString(),
  },
];

const onError = (data: any) => {
  showNotification({
    title: <Text fw="bold">Falha na busca dos produtos</Text>,
    message: (
      <Text color="dimmed">{data.response.data.message || data.message}</Text>
    ),
    color: 'red',
    autoClose: false,
    icon: <IconExclamationCircle />,
  });
};

export const Producao = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [search, setSearch] = useState({
    type: 'titulo',
    placeholder: 'Pesquise pelo Titulo',
  });
  const [filtro, setFiltro] = useDebouncedState(
    {
      codigo: '',
      titulo: '',
    },
    300,
  );

  const { data: produtos, isLoading } = useProducaoData({
    onError,
    filter: filtro,
    page,
    perPage,
  });

  const handleSearch = (value: string) => {
    setFiltro({
      codigo: '',
      titulo: '',
    });
    if (search.type == 'titulo') setFiltro({ ...filtro, titulo: value });
    if (search.type == 'codigo') setFiltro({ ...filtro, codigo: value });
  };

  return (
    <Box className="flex flex-col gap-1 h-[97vh]">
      <Paper
        withBorder
        radius={0}
        h={60}
        p="sm"
        className="flex justify-between items-center"
      >
        <Box className="flex items-center gap-3">
          <Link to="/producao/pedidos">
            <Button radius={0} variant="outline" size="md">
              Pedidos
            </Button>
          </Link>
          <Link to="/producao">
            <Button radius={0} size="md">
              Produção
            </Button>
          </Link>
          <Link to="/pedidos/cadastrar">
            <Button radius={0} size="md" variant="outline">
              Caixa
            </Button>
          </Link>
        </Box>
        <MenuCaixa />
      </Paper>
      <Paper withBorder className="rounded-none h-[8%] grid grid-cols-5 ">
        <div className="grid grid-cols-2">
          <Button
            variant="subtle"
            color={search.type != 'titulo' ? 'gray' : 'blue'}
            className="w-full h-full rounded-none border border-solid border-gray-300 border-t-0 border-b-0 border-l-0"
            onClick={() =>
              setSearch({ type: 'titulo', placeholder: 'Pesquise pelo titulo' })
            }
          >
            <IconTag />
          </Button>
          <Button
            color={search.type != 'codigo' ? 'gray' : 'blue'}
            variant="subtle"
            className="w-full h-full rounded-none border border-solid border-gray-300 border-t-0 border-b-0 border-l-0"
            onClick={() =>
              setSearch({ type: 'codigo', placeholder: 'Pesquise pelo código' })
            }
          >
            <IconHash />
          </Button>
        </div>
        <div className="col-span-3 flex items-center px-3">
          <TextInput
            variant="unstyled"
            ref={inputRef}
            onChange={(e) => handleSearch(e.currentTarget.value)}
            placeholder={search.placeholder}
            className="w-full"
          />
        </div>
        <Button
          leftIcon={<IconPlus />}
          variant="light"
          className="w-full h-full rounded-none "
          component={Link}
          to="/producao/cadastrar"
        >
          Adicionar
        </Button>
      </Paper>
      <Paper withBorder radius={0} h="100%" p="sm">
        <Tabela
          columns={columns}
          data={produtos?.data}
          isLoading={isLoading}
          page={page}
          setPage={setPage}
          perPage={perPage}
          setPerPage={setPerPage}
        />
      </Paper>
    </Box>
  );
};
