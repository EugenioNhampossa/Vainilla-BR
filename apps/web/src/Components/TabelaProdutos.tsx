import {
  Box,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { closeAllModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import {
  IconCloudDownload,
  IconExclamationCircle,
  IconSearch,
} from '@tabler/icons';
import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../Shared/api';
import { artigoActions } from '../Store/artigos/artigos-slice';
import { useAppSelector } from '../hooks/appStates';

const PERPAGE = 25;

export const TabelaProdutos = ({ onAddClick }: any) => {
  const [produtos, setProdutos] = useState([]);
  const [titulo, setTitulo] = useDebouncedState('', 300);
  const selectedRecords = useAppSelector(
    (state) => state.artigo.selected_products,
  );
  const dispatch = useDispatch();

  const columns = [
    { accessor: 'codigo', title: 'Código' },
    { accessor: 'titulo', title: 'Título' },
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

  const fetchProdutos = ({ pageParam = 1 }) => {
    let query = '';
    if (titulo) query += `&titulo=${titulo}`;
    return api.get(`/produtos?perPage=${PERPAGE}&page=${pageParam}${query}`);
  };

  const {
    data,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    hasNextPage,
  } = useInfiniteQuery(['produtos-infinite', titulo], fetchProdutos, {
    onError,
    getNextPageParam: (_lastPage, pages) => {
      if (pages.length < pages[0].data.meta.lastPage) {
        return pages.length + 1;
      } else {
        return undefined;
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [titulo]);

  useEffect(() => {
    let groups: any = [];
    data?.pages.map((group, i) => {
      group.data.data.map((produtos: any) => {
        groups.push(produtos);
      });
    });
    setProdutos(groups);
  }, [data]);

  const handleAddClick = () => {
    onAddClick(selectedRecords);
    closeAllModals();
  };

  return (
    <>
      <Stack>
        <TextInput
          icon={<IconSearch />}
          placeholder="Pesquise pelo titulo"
          onChange={(event) => setTitulo(event.currentTarget.value)}
        />
        <Paper withBorder pb="xs">
          <Stack spacing="xs">
            <Box sx={{ height: 300 }}>
              <DataTable
                striped
                highlightOnHover
                noRecordsText="Sem dados por mostrar"
                minHeight={150}
                columns={columns}
                fetching={isLoading}
                records={produtos}
                selectedRecords={selectedRecords}
                onSelectedRecordsChange={(value) => 
                  dispatch(artigoActions.setSelectedProducts(value))
                }
              />
            </Box>
            {hasNextPage && (
              <Group position="center">
                <Button
                  loading={isFetchingNextPage}
                  color="gray.7"
                  compact
                  variant="subtle"
                  onClick={() => fetchNextPage()}
                  leftIcon={<IconCloudDownload />}
                >
                  Carregar mais produtos
                </Button>
              </Group>
            )}
          </Stack>
        </Paper>
        <Button onClick={handleAddClick}>Adicionar</Button>
      </Stack>
    </>
  );
};
