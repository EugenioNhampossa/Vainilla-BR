import { TitleBar } from '../../../Components/TitleBar';
import {
  Box,
  Container,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { Tabela } from '../../../Components/Tabela/Tabela';
import { DatePicker } from '@mantine/dates';
import { useContagem } from '../../../hooks/HandleContagem/useContagemData';
import { useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { IconCash, IconExclamationCircle } from '@tabler/icons';

const columns = [
  { accessor: 'Artigo.codigo', title: 'Código' },
  { accessor: 'Artigo.titulo', title: 'Produto' },
  {
    accessor: 'qty_contada',
    title: 'Qt.Contada',
    render: ({ qty_preparada, qty_porPreparar }: any) => {
      return parseFloat(qty_preparada) + parseFloat(qty_porPreparar);
    },
  },
  {
    accessor: 'precoCusto',
    title: 'Preço de Custo',
    render: ({ Artigo }: any) => {
      const preco = parseFloat(Artigo.valorTotal) / parseFloat(Artigo.qtyTotal);
      return `${preco.toLocaleString('en', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} MT`;
    },
  },
  {
    accessor: 'valor',
    title: 'Valor',
    render: ({ Artigo, qty_preparada, qty_porPreparar }: any) => {
      const qty = parseFloat(qty_preparada) + parseFloat(qty_porPreparar);
      const preco = parseFloat(Artigo.valorTotal) / parseFloat(Artigo.qtyTotal);
      return `${(preco * qty).toLocaleString('en', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} MT`;
    },
  },
  {
    accessor: 'dataCriacao',
    title: 'Data de Registro',
    render: ({ dataCriacao }: any) => {
      return new Date(dataCriacao).toLocaleDateString();
    },
  },
];

const StockTake = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [filter, setFilter] = useState<any>({
    data: new Date(),
  });

  const onError = (data: any) => {
    showNotification({
      title: <Text fw="bold">Falha na busca da contagem</Text>,
      message: (
        <Text color="dimmed">{data.response.data.message || data.message}</Text>
      ),
      color: 'red',
      autoClose: false,
      icon: <IconExclamationCircle />,
    });
  };

  const { data: contagem, isLoading } = useContagem({
    onError,
    filter,
    page,
    perPage,
  });

  return (
    <>
      <TitleBar title={'Stock take report'} />
      <SimpleGrid
        cols={3}
        breakpoints={[
          { maxWidth: 'md', cols: 3, spacing: 'md' },
          { maxWidth: 'sm', cols: 2, spacing: 'sm' },
          { maxWidth: 'xs', cols: 1, spacing: 'sm' },
        ]}
      >
        <Paper shadow="lg" p="sm" radius="sm">
          <DatePicker
            placeholder="Pesquise pela data"
            variant="filled"
            label={<Box mb='sm'>Data de Registro</Box>}
            defaultValue={filter?.data}
            onChange={(value) => setFilter({ data: value })}
          />
        </Paper>
        <Paper shadow="lg" p="sm" radius="sm">
          <Stack>
            <Group position="apart">
              <Box c="gray.7" className="text-sm">
                Valor total
              </Box>
              <ThemeIcon color="grape" variant="light">
                <IconCash size={18} />
              </ThemeIcon>
            </Group>
            <Box c="gray.7" className="font-semibold">
              {isLoading ? (
                <Loader size="sm" variant="dots" />
              ) : (
                `${parseFloat(contagem?.data.total).toLocaleString('en', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} MT`
              )}
            </Box>
          </Stack>
        </Paper>
      </SimpleGrid>
      <Paper shadow="sm">
        <Container my="xl" py={'md'} size={'lg'}>
          <Tabela
            columns={columns}
            data={contagem?.data.contagem}
            isLoading={isLoading}
            page={page}
            setPage={setPage}
            perPage={perPage}
            setPerPage={setPerPage}
          />
        </Container>
      </Paper>
    </>
  );
};

export default StockTake;
