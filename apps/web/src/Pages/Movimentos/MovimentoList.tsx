import {
  Button,
  Paper,
  SimpleGrid,
  Stack,
  Badge,
  SegmentedControl,
  Center,
  Box,
  Group,
} from '@mantine/core';
import { IconPlus, IconShoppingBag, IconTags } from '@tabler/icons';
import { TitleBar } from '../../Components/TitleBar';
import { Tabela } from '../../Components/Tabela/Tabela';
import { useState } from 'react';
import { DateRangePicker, DateRangePickerValue } from '@mantine/dates';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import { useSaidasStockData } from '../../hooks/HandleSaidaStock/useSaidaStockData';
import { useEntradasStockData } from '../../hooks/HandleEntradaStock/useEntradaStockData';

const columnsSaidas = [
  {
    accessor: 'codigo',
    title: 'Código',
    render: ({ Produto, Artigo }: any) => {
      if (Produto) {
        return Produto.codigo;
      }
      if (Artigo) {
        return Artigo.codigo;
      }
    },
  },
  {
    accessor: 'Item',
    title: 'Item',
    render: ({ Produto, Artigo }: any) => {
      if (Produto) {
        return Produto.titulo;
      }
      if (Artigo) {
        return Artigo.titulo;
      }
    },
  },
  { accessor: 'Instalacao.titulo', title: 'Instalação' },
  {
    accessor: 'tipo_saida',
    title: 'Operacao',
    render: ({ tipo_saida }: any) => {
      return (
        <Badge color={tipo_saida == 'Desperdicio' ? 'red' : 'orange'}>
          {tipo_saida}
        </Badge>
      );
    },
  },
  { accessor: 'quantidade', title: 'Quantidade' },
  {
    accessor: 'unidade',
    title: 'Unidade',
    render: ({ Produto, Artigo }: any) => {
      if (Produto) {
        return 'UNI';
      }
      if (Artigo) {
        return Artigo.unidade;
      }
    },
  },
  {
    accessor: 'dataCriacao',
    title: 'Registrado em',
    render: ({ dataCriacao }: any) =>
      new Date(dataCriacao).toLocaleString('pt'),
  },
];

const columnsEntradas = [
  {
    accessor: 'Artigo.codigo',
    title: 'Código',
  },
  {
    accessor: 'Artigo.titulo',
    title: 'Item',
  },
  { accessor: 'Instalacao.titulo', title: 'Instalação' },
  { accessor: 'quantidade', title: 'Quantidade' },
  { accessor: 'Artigo.unidade', title: 'Unidade' },
  {
    accessor: 'dataCriacao',
    title: 'Registrado em',
    render: ({ dataCriacao }: any) =>
      new Date(dataCriacao).toLocaleString('pt'),
  },
];

export const MovimentoList = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(30);
  const [datas, setDatas] = useState<DateRangePickerValue>([
    new Date(),
    new Date(),
  ]);
  const [tipoMovimento, setTipoMovimento] = useState('Saidas');

  const { user } = useAuth0();

  const { data: saidas, isLoading: isLoadingSaidas } = useSaidasStockData({
    filter: { id_instalacao: user?.id_instalacao, datas },
    page,
    perPage,
  });

  const { data: entradas, isLoading: isLoadingEntradas } = useEntradasStockData(
    {
      filter: { id_instalacao: user?.id_instalacao, datas },
      page,
      perPage,
    },
  );

  return (
    <Stack>
      <TitleBar
        title={'Movimentos de stock'}
        rightSection={
          <Group>
            <Button
              component={Link}
              to={'/movimentos/saidas/cadastrar'}
              size="xs"
              leftIcon={<IconPlus size={16} />}
            >
              Adicionar saídas
            </Button>{' '}
            <Button
              component={Link}
              to={'/movimentos/entradas/cadastrar'}
              size="xs"
              leftIcon={<IconPlus size={16} />}
            >
              Adicionar entradas
            </Button>
          </Group>
        }
      />
      <Paper p="sm" shadow="sm">
        <SimpleGrid
          cols={3}
          breakpoints={[
            { maxWidth: 'md', cols: 3, spacing: 'md' },
            { maxWidth: 'sm', cols: 2, spacing: 'sm' },
            { maxWidth: 'xs', cols: 1, spacing: 'sm' },
          ]}
        >
          <DateRangePicker
            variant="filled"
            label="Período de registro"
            allowSingleDateInRange
            name="data"
            clearable={false}
            defaultValue={datas}
            onChange={setDatas}
            placeholder="Insira o período de Registro"
          />
        </SimpleGrid>
      </Paper>
      <Paper p="sm" shadow="sm">
        <SegmentedControl
          mb="sm"
          color="blue"
          value={tipoMovimento}
          onChange={setTipoMovimento}
          data={['Saidas', 'Entradas']}
        />
        <Tabela
          columns={tipoMovimento == 'Saidas' ? columnsSaidas : columnsEntradas}
          data={tipoMovimento == 'Saidas' ? saidas?.data : entradas?.data}
          isLoading={isLoadingEntradas || isLoadingSaidas}
          page={page}
          setPage={setPage}
          perPage={perPage}
          setPerPage={setPerPage}
        />
      </Paper>
    </Stack>
  );
};

export default MovimentoList;
