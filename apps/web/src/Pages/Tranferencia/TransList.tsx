import {
  Button,
  Container,
  Group,
  Paper,
  Text,
  SimpleGrid,
  Tooltip,
  MediaQuery,
  Accordion,
  Select,
} from '@mantine/core';
import {
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
import { useFamiliasData } from '../../hooks/HandleFamilia/useFamiliasData';
import { useTransData } from '../../hooks/HandleTransferencia/useTransData';
import { useInstalacoesData } from '../../hooks/HandleInstalacao/useInstalacaoData';
import { SearchableSelect } from '../../Components/AsyncSearchableSelect/SeachableSelect';
import { DatePicker, DateRangePicker } from '@mantine/dates';

const rightSection = (
  <div>
    <Link to={'/transferencias/cadastrar'}>
      <Button size="xs" leftIcon={<IconPlus size={16} />}>
        Adicionar
      </Button>
    </Link>
  </div>
);

const columns = [
  { accessor: 'Partida.titulo', title: 'Partida' },
  { accessor: 'Destino.titulo', title: 'Destino' },
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
        <Tooltip label={'Ver mais informações'} position="left">
          <Link to={`/transferencias/${record.id}/itens`}>
            <Button compact color="teal" variant="light">
              <IconListDetails size={19} />
            </Button>
          </Link>
        </Tooltip>
      </Group>
    ),
  },
];

export const TransList = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [filter, setFilter]: any = useState({
    id_estPartida: '',
    id_estDestino: '',
    firstDate: '',
    condition: '',
    secondDate: '',
  });

  const onError = (data: any) => {
    showNotification({
      title: <Text fw="bold">Falha na busca das sub-famílias</Text>,
      message: (
        <Text color="dimmed">{data.response.data.message || data.message}</Text>
      ),
      color: 'red',
      autoClose: false,
      icon: <IconExclamationCircle />,
    });
  };

  const {
    data: transferencias,
    isLoading,
    isError,
  } = useTransData({ onError, filter, page, perPage });

  const onFilterSubmit = (e: any) => {
    e.preventDefault();
    setFilter({
      id_estPartida: e.target.id_estPartida?.value,
      id_estDestino: e.target.id_estDestino?.value,
      firstDate: e.target.firstDate?.value,
      condition: e.target.condition?.value,
      secondDate: e.target.secondDate?.value,
    });
    setPage(1);
  };

  const reset = () => {
    const form: any = document.getElementById('filterTrans');
    form.reset();
    setFilter({
      id_estPartida: '',
      id_estDestino: '',
      firstDate: '',
      condition: 'equals',
      secondDate: '',
    });
  };

  const filterForm = (
    <form id="filterTrans" onSubmit={(e) => onFilterSubmit(e)}>
      <SimpleGrid
        cols={3}
        breakpoints={[
          { maxWidth: 'md', cols: 3, spacing: 'md' },
          { maxWidth: 'sm', cols: 2, spacing: 'sm' },
          { maxWidth: 'xs', cols: 1, spacing: 'sm' },
        ]}
        mb="md"
      >
        <SimpleGrid>
          <SearchableSelect
            placeholder="Seleccione o Instalação"
            initialValue={[]}
            editEnabled={true}
            fetchFuntion={useInstalacoesData}
            name="id_estPartida"
            onErrorMessage="Erro ao buscar os Instalações"
            labelText="Instalação de Partida"
          />
          <SearchableSelect
            placeholder="Seleccione o Instalação"
            initialValue={[]}
            editEnabled={true}
            fetchFuntion={useInstalacoesData}
            name="id_estDestino"
            onErrorMessage="Erro ao buscar os Instalações"
            labelText="Instalação de Chegada"
          />
        </SimpleGrid>
        <Paper withBorder p="sm">
          <Select
            label="Condição"
            variant="filled"
            data={[
              { value: 'equals', label: 'Igual a' },
              { value: 'gte', label: 'Depois de' },
              { value: 'lte', label: 'Antes de' },
              { value: 'between', label: 'Entre' },
            ]}
            name="condition"
            defaultValue={'equals'}
            onChange={(value) => setFilter({ ...filter, condition: value })}
          />
          <DatePicker
            variant="filled"
            mt="xs"
            placeholder="seleccione uma data"
            label="Data de registro"
            name="firstDate"
          />
          {filter.condition === 'between' && (
            <DatePicker
              variant="filled"
              mt="xs"
              placeholder="seleccione uma data"
              label="Data de registro"
              name="secondDate"
            />
          )}
        </Paper>
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
      <TitleBar title={'Transferências'} rightSection={rightSection} />
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
            data={transferencias?.data}
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

export default TransList;
