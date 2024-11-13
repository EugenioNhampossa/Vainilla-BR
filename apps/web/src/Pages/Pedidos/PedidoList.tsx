import {
  Button,
  Container,
  Group,
  Paper,
  TextInput,
  Text,
  SimpleGrid,
  Tooltip,
  MediaQuery,
  Accordion,
  Badge,
} from '@mantine/core';
import {
  IconEdit,
  IconFilter,
  IconFilterOff,
  IconListDetails,
} from '@tabler/icons';
import { TitleBar } from '../../Components/TitleBar';
import { Link } from 'react-router-dom';
import { Tabela } from '../../Components/Tabela/Tabela';
import { useState } from 'react';
import { usePedidosData } from '../../hooks/HandlePedido/usePedidoData';
import {
  DateRangePicker,
  DateRangePickerValue,
} from '@mantine/dates';

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
        <Tooltip label={'Editar'} position="left">
          <Link to={`/pedidos/actualizar/${record.id}`}>
            <Button compact variant="light" color="blue">
              <IconEdit size={19} />
            </Button>
          </Link>
        </Tooltip>
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

export const PedidoList = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [filter, setFilter] = useState<{
    codigo: string;
    datas: DateRangePickerValue;
  }>({
    codigo: '',
    datas: [new Date(), new Date()],
  });

  const { data: pedidos, isLoading } = usePedidosData({
    filter,
    page,
    perPage,
  });

  const onFilterSubmit = (e: any) => {
    e.preventDefault();
    setFilter({
      codigo: e.target.codigo?.value.trim(),
      datas: filter.datas,
    });
    setPage(1);
  };

  const reset = () => {
    const form: any = document.getElementById('filterPedido');
    setFilter({
      codigo: '',
      datas: [new Date(), new Date()],
    });
    form.reset();
  };

  const filterForm = (
    <form id="filterPedido" onSubmit={(e) => onFilterSubmit(e)}>
      <SimpleGrid
        cols={3}
        breakpoints={[
          { maxWidth: 'md', cols: 3, spacing: 'md' },
          { maxWidth: 'sm', cols: 2, spacing: 'sm' },
          { maxWidth: 'xs', cols: 1, spacing: 'sm' },
        ]}
        mb="md"
      >
        <TextInput
          label="Código"
          variant="filled"
          name="codigo"
          placeholder="Insira o Código"
        />
        <DateRangePicker
          variant="filled"
          label='Período de registro'
          allowSingleDateInRange
          name="data"
          clearable={false}
          defaultValue={filter.datas}
          onChange={(value: any) =>
            setFilter({ ...filter, datas: value || new Date() })
          }
          placeholder="Insira o período de Registro"
        />
      </SimpleGrid>
      <Group position="right">
        <Button
          variant="outline"
          onClick={() => reset()}
          compact
          leftIcon={<IconFilterOff />}
        >
          Limpar
        </Button>
        <Button type="submit" compact leftIcon={<IconFilter />}>
          Filtrar
        </Button>
      </Group>
    </form>
  );

  return (
    <>
      <TitleBar title={'Pedidos'} />
      <Paper shadow="sm">
        <Container my="xl" py={'md'} size={'lg'}>
          <MediaQuery smallerThan={'xs'} styles={{ display: 'none' }}>
            {filterForm}
          </MediaQuery>
          <MediaQuery largerThan={'xs'} styles={{ display: 'none' }}>
            <Accordion variant="separated">
              <Accordion.Item value="filtros">
                <Accordion.Control icon={<IconFilter size={20} color="blue" />}>
                  <Text fw={'bold'}>Filtros</Text>
                </Accordion.Control>
                <Accordion.Panel>{filterForm}</Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </MediaQuery>
        </Container>
      </Paper>
      <Paper shadow="sm">
        <Container my="xl" py={'md'} size={'lg'}>
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

export default PedidoList;
