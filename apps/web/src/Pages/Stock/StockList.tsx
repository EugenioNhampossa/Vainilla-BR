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
  Select,
  Space,
} from '@mantine/core';
import {
  IconEdit,
  IconExclamationCircle,
  IconFilter,
  IconFilterOff,
  IconListDetails,
  IconPlus,
} from '@tabler/icons';
import { TitleBar } from '../../Components/TitleBar';
import { Link } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { Tabela } from '../../Components/Tabela/Tabela';
import { useState } from 'react';
import { SearchableSelect } from '../../Components/AsyncSearchableSelect/SeachableSelect';
import { useStockData } from '../../hooks/HandleStock/useStockData';
import { useInstalacoesData } from '../../hooks/HandleInstalacao/useInstalacaoData';
import { useArtigosData } from '../../hooks/HandleArtigo/useArtigosData';

const rightSection = (
  <div>
    <Link to={'/stock/cadastrar'}>
      <Button size="xs" leftIcon={<IconPlus size={16} />}>
        Adicionar
      </Button>
    </Link>
  </div>
);

const columns = [
  { accessor: 'Artigo.titulo', title: 'Artigo' },
  { accessor: 'Instalacao.titulo', title: 'Instalação' },
  { accessor: 'actual', title: 'Qt. Actual' },
  { accessor: 'minimo', title: 'Qt. Mínima' },
  { accessor: 'maximo', title: 'Qt. Máxima' },
  {
    accessor: 'dataCriacao',
    title: 'Registrado em',
    hidden: true,
    render: ({ dataCriacao }: any) =>
      new Date(dataCriacao).toLocaleString('pt'),
  },
  {
    accessor: 'dataActualizacao',
    title: 'Ultima Actualizacao',
    hidden: true,
    render: ({ dataActualizacao }: any) =>
      new Date(dataActualizacao).toLocaleString('pt'),
  },
  {
    accessor: 'actions',
    title: <Text mr="xs">Acções</Text>,
    render: (record: any) => (
      <Group spacing={4} noWrap>
        <Tooltip label={'Editar'} position="left">
          <Link to={`/stock/actualizar/${record.id}`}>
            <Button compact variant="light" color="blue">
              <IconEdit size={19} />
            </Button>
          </Link>
        </Tooltip>
        <Tooltip label={'Ver mais informações'} position="left">
          <Link to={`/stock/${record.id}`}>
            <Button compact color="teal" variant="light">
              <IconListDetails size={19} />
            </Button>
          </Link>
        </Tooltip>
      </Group>
    ),
  },
];

export const StockList = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [filter, setFilter] = useState({
    id_artigo: '',
    id_instalacao: '',
    aFirst: '',
    aCondition: '',
  });

  const onError = (data: any) => {
    showNotification({
      title: <Text fw="bold">Falha na busca do stock dos artigos</Text>,
      message: (
        <Text color="dimmed">{data.response.data.message || data.message}</Text>
      ),
      color: 'red',
      autoClose: false,
      icon: <IconExclamationCircle />,
    });
  };

  const {
    data: stock,
    isLoading,
  } = useStockData({ onError, filter, page, perPage });

  const onFilterSubmit = (e: any) => {
    e.preventDefault();

    setFilter({
      id_artigo: e.target.id_artigo.value,
      id_instalacao: e.target.id_instalacao.value,
      aFirst: e.target.aFirst.value.trim(),
      aCondition: e.target.aCondition.value,
    });

    setPage(1);
  };

  const reset = () => {
    const form: any = document.getElementById('filterStock');
    form.reset();
    setFilter({
      id_artigo: '',
      id_instalacao: '',
      aFirst: '',
      aCondition: '',
    });
  };

  const filterForm = (
    <form id="filterStock" onSubmit={(e) => onFilterSubmit(e)}>
      <SimpleGrid
        cols={3}
        breakpoints={[
          { maxWidth: 'md', cols: 3, spacing: 'md' },
          { maxWidth: 'sm', cols: 2, spacing: 'sm' },
          { maxWidth: 'xs', cols: 1, spacing: 'sm' },
        ]}
        mb="md"
      >
        <SearchableSelect
          placeholder="Seleccione o artigo"
          fetchFuntion={useArtigosData}
          name="id_artigo"
          onErrorMessage="Erro ao buscar os Artigos"
          labelText="Artigo"
        />
        <SearchableSelect
          placeholder="Seleccione o Instalação"
          fetchFuntion={useInstalacoesData}
          name="id_instalacao"
          onErrorMessage="Erro ao buscar os Instalações"
          labelText="Instalação"
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
      <TitleBar title={'Stock'} rightSection={rightSection} />
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
            data={stock?.data}
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

export default StockList;
