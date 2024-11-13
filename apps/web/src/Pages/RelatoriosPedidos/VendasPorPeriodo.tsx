import {
  Badge,
  Box,
  Button,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  ThemeIcon,
  Tooltip,
  Text,
  LoadingOverlay,
  Loader,
} from '@mantine/core';
import { TitleBar } from '../../Components/TitleBar';
import { Tabela } from '../../Components/Tabela/Tabela';
import { useState } from 'react';
import {
  useGetMetrics,
  usePedidosData,
} from '../../hooks/HandlePedido/usePedidoData';
import {
  DatePicker,
  DateRangePicker,
  DateRangePickerValue,
} from '@mantine/dates';
import { IconCash, IconEdit, IconHash, IconListDetails } from '@tabler/icons';
import { Link } from 'react-router-dom';

const columns = [
  { accessor: 'codigo', title: 'Código' },
  { accessor: 'Caixa.Instalacao.titulo', title: 'Instalação' },
  { accessor: 'Caixa.codigo', title: 'Caixa' },
  {
    accessor: 'Cliente.nome',
    title: 'Cliente',
    render: ({ Cliente }: any) => {
      if (Cliente?.nome) {
        return <div className="font-bold text-orange-500">{Cliente.nome}</div>;
      } else {
        return <div className="font-bold text-stone-500 text-xs">UNKNOWN</div>;
      }
    },
  },
  {
    accessor: 'Pagamento.tipoPagamento',
    title: 'Pagamento',
    render: ({ Pagamento }: any) => getBadge(Pagamento?.tipoPagamento),
  },
  {
    accessor: 'estado',
    title: 'Estado',
  },
  {
    accessor: 'dataCriacao',
    title: 'Registrado em',
    render: ({ dataCriacao }: any) =>
      new Date(dataCriacao).toLocaleString('pt'),
  },
  {
    accessor: 'actions',
    title: <Text mr="xs">Acções</Text>,
    render: (record: any) => (
      <Group spacing={4} noWrap>
        <Tooltip label={'Ver detalhes'} position="left">
          <Link to={`/pedidos/${record.id}/`}>
            <Button compact color="teal" variant="light">
              <IconListDetails size={19} />
            </Button>
          </Link>
        </Tooltip>
      </Group>
    ),
  },
];

const getBadge = (tipo: string) => {
  switch (tipo) {
    case 'CASH':
      return (
        <Badge color="gray" radius="sm">
          CASH
        </Badge>
      );
    case 'CCREDITO':
      return (
        <Badge color="pink" radius="sm">
          C.CREDITO
        </Badge>
      );
    case 'CDEBITO':
      return (
        <Badge color="green" radius="sm">
          C.DEBITO
        </Badge>
      );
    case 'CHECK':
      return (
        <Badge color="red" radius="sm">
          CHECK
        </Badge>
      );
    default:
      return;
  }
};

const VendasPorPeriodo = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [datas, setDatas] = useState<DateRangePickerValue>([
    new Date(),
    new Date(),
  ]);

  const { data: pedidos, isLoading } = usePedidosData({
    filter: { datas },
    page,
    perPage,
  });

  const { data: metrics, isLoading: isLoadingMetrics } = useGetMetrics(datas);

  return (
    <>
      <TitleBar title={'Vendas por período'} />
      <SimpleGrid
        cols={3}
        breakpoints={[
          { maxWidth: 'md', cols: 3, spacing: 'md' },
          { maxWidth: 'sm', cols: 2, spacing: 'sm' },
          { maxWidth: 'xs', cols: 1, spacing: 'sm' },
        ]}
        mt={'md'}
      >
        <Paper shadow="lg" p="sm" radius="sm">
          <Stack>
            <Group position="apart">
              <Box c="gray.7" className="text-sm">
                Tatal de vendas
              </Box>
              <ThemeIcon color="green" variant="light">
                <IconHash size={18} />
              </ThemeIcon>
            </Group>
            <Box c="gray.7" className="font-semibold">
              {isLoadingMetrics ? (
                <Loader size="sm" variant="dots" />
              ) : (
                metrics?.data.nrPedidos
              )}
            </Box>
          </Stack>
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
              {isLoadingMetrics ? (
                <Loader size="sm" variant="dots" />
              ) : (
                `${parseFloat(metrics?.data.total).toLocaleString('en', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} MT`
              )}
            </Box>
          </Stack>
        </Paper>
      </SimpleGrid>
      <Paper shadow="sm">
        <Container my="xl" py={'md'} size={'lg'}>
          <Group mb="xs">
            <DateRangePicker
              variant="filled"
              allowSingleDateInRange
              name="data"
              clearable={false}
              defaultValue={datas}
              onChange={setDatas}
              placeholder="Insira o período de Registro"
            />
          </Group>
          <Tabela
            columns={columns}
            data={pedidos?.data}
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

export default VendasPorPeriodo;
