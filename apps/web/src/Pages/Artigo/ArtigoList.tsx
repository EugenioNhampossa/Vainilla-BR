import {
  Button,
  Container,
  Group,
  Paper,
  TextInput,
  Text,
  Tooltip,
  Accordion,
  Grid,
  Col,
  Stack,
} from '@mantine/core';
import {
  IconEdit,
  IconExclamationCircle,
  IconFileText,
  IconFilter,
  IconFilterOff,
  IconPlus,
} from '@tabler/icons';
import { TitleBar } from '../../Components/TitleBar';
import { Link } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { Tabela } from '../../Components/Tabela/Tabela';
import { useState } from 'react';
import { useArtigosData } from '../../hooks/HandleArtigo/useArtigosData';
import { SearchableSelect } from '../../Components/AsyncSearchableSelect/SeachableSelect';
import { useFamiliasData } from '../../hooks/HandleFamilia/useFamiliasData';
import { useSubFamiliasData } from '../../hooks/HandleSubFamilia/useSubFamiliasData';
import { useForm } from '@mantine/form';
import { useMarcasData } from '../../hooks/HandleMarca/useMarcasData';

const rightSection = (
  <div>
    <Link to={'/artigos/cadastrar'}>
      <Button size="xs" leftIcon={<IconPlus size={16} />}>
        Adicionar
      </Button>
    </Link>
  </div>
);

const columns = [
  { accessor: 'codigo', title: 'Código' },
  { accessor: 'titulo', title: 'Título' },
  { accessor: 'SubFamilia.titulo', title: 'Sub-família' },
  { accessor: 'unidade', title: 'Unidade' },
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
        <Tooltip label={'Editar ' + record.titulo} position="left">
          <Link to={`/artigos/actualizar/${record.id}`}>
            <Button compact variant="light" color="blue">
              <IconEdit size={19} />
            </Button>
          </Link>
        </Tooltip>
        <Tooltip label={'Ficha de ' + record.titulo} position="left">
          <Link to={`/artigos/${record.id}`}>
            <Button
              leftIcon={<IconFileText />}
              compact
              variant="light"
              color="teal.6"
            >
              Ficha
            </Button>
          </Link>
        </Tooltip>
      </Group>
    ),
  },
];

const rowExpansion = {
  content: ({ record }: any) => (
    <Group p="xs" ml="md" spacing={6}>
      <Text fw="bold">Descricao:</Text>
      <Text>{record.descricao}</Text>
    </Group>
  ),
};

export const ArtigoList = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [filter, setFilter] = useState({
    titulo: '',
    codigo: '',
    id_tipo: '',
    id_marca: '',
    id_modelo: '',
    id_familia: '',
    id_subfamilia: '',
    unidade: '',
    perecivel: '',
    status: '',
    deduzIva: '',
    pVFirst: '',
    pVSecond: '',
    pVCondition: '',
    tIFirst: '',
    tISecond: '',
    tICondition: '',
  });

  const onError = (data: any) => {
    showNotification({
      title: <Text fw="bold">Falha na busca dos artigos</Text>,
      message: (
        <Text color="dimmed">{data.response.data.message || data.message}</Text>
      ),
      color: 'red',
      autoClose: false,
      icon: <IconExclamationCircle />,
    });
  };

  const {
    data: artigos,
    isLoading,
    isError,
  } = useArtigosData({ onError, filter, page, perPage });

  const onFilterSubmit = (e: any) => {
    e.preventDefault();

    setFilter({
      titulo: e.target.titulo?.value.trim(),
      codigo: e.target.codigo?.value.trim(),
      id_tipo: e.target.id_tipo?.value,
      id_marca: e.target.id_marca?.value,
      id_modelo: e.target.id_modelo?.value,
      id_familia: e.target.id_familia?.value,
      id_subfamilia: e.target.id_subfamilia?.value,
      unidade: e.target.unidade?.value,
      perecivel: e.target.perecivel?.value,
      status: e.target.status?.value,
      deduzIva: e.target.deduzIva?.value,
      pVFirst: e.target.pVFirst?.value,
      pVSecond: e.target.pVSecond?.value,
      pVCondition: e.target.pVCondition?.value,
      tIFirst: e.target.tIFirst?.value,
      tISecond: e.target.tISecond?.value,
      tICondition: e.target.tICondition?.value,
    });
    setPage(1);
  };

  const reset = () => {
    const form: any = document.getElementById('filterForm');
    form.reset();

    setFilter({
      titulo: '',
      codigo: '',
      id_tipo: '',
      id_marca: '',
      id_modelo: '',
      id_familia: '',
      id_subfamilia: '',
      unidade: '',
      perecivel: '',
      status: '',
      deduzIva: '',
      pVFirst: '',
      pVSecond: '',
      pVCondition: '',
      tIFirst: '',
      tISecond: '',
      tICondition: '',
    });
  };

  const form = useForm();

  const filterForm = (
    <form id="filterForm" onSubmit={(e) => onFilterSubmit(e)}>
      <Stack>
        <Grid>
          <Col md={4} xs={12}>
            <TextInput
              label="Código"
              name="codigo"
              variant="filled"
              placeholder="Insira o código"
            />
          </Col>
          <Col md={4} xs={12}>
            <TextInput
              label="Título"
              name="titulo"
              variant="filled"
              placeholder="Insira o título"
            />
          </Col>
          <Col md={4} xs={12}>
            <SearchableSelect
              placeholder="Seleccione a marca"
              initialValue={[]}
              editEnabled={true}
              fetchFuntion={useMarcasData}
              name="id_marca"
              form={form}
              onErrorMessage="Erro ao buscar as marcas"
              labelText="Marca"
            />
          </Col>
          <Col md={4} xs={12}>
            <SearchableSelect
              placeholder="Seleccione a família"
              initialValue={[]}
              editEnabled={true}
              fetchFuntion={useFamiliasData}
              name="id_familia"
              form={form}
              onErrorMessage="Erro ao buscar as familias"
              labelText="Família"
            />
          </Col>
          <Col md={4} xs={12}>
            <SearchableSelect
              placeholder="Seleccione a sub-família"
              initialValue={[]}
              editEnabled={true}
              fetchFuntion={useSubFamiliasData}
              idFilter={form.values.id_familia}
              name="id_subfamilia"
              onErrorMessage="Erro ao buscar as subFamilias"
              labelText="Sub-família"
            />
          </Col>
        </Grid>
      </Stack>
      <Group position="right" mt={'lg'}>
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
      <TitleBar title={'Artigos'} rightSection={rightSection} />
      <Paper shadow="sm">
        <Container my="xl" py={'md'} size={'lg'}>
          <Accordion variant="separated">
            <Accordion.Item value="filtros">
              <Accordion.Control icon={<IconFilter size={20} color="blue" />}>
                <Text fw={'bold'}>Filtros</Text>
              </Accordion.Control>
              <Accordion.Panel>{filterForm}</Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Container>
      </Paper>
      <Paper shadow="sm">
        <Container my="xl" py={'md'} size={'lg'}>
          <Tabela
            columns={columns}
            data={artigos?.data}
            rowExpansion={rowExpansion}
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

export default ArtigoList;
