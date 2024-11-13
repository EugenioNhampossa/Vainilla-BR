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
  Badge,
  Stack,
  Box,
} from '@mantine/core';
import {
  IconEdit,
  IconExclamationCircle,
  IconFilter,
  IconFilterOff,
  IconPlus,
} from '@tabler/icons';
import { TitleBar } from '../../Components/TitleBar';
import { Link } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { Tabela } from '../../Components/Tabela/Tabela';
import { useState } from 'react';
import { useInstalacoesData } from '../../hooks/HandleInstalacao/useInstalacaoData';

const columns = [
  { accessor: 'codigo', title: 'Código' },
  {
    accessor: 'titulo',
    title: 'Título',
  },
  {
    accessor: 'tipo',
    title: 'Tipo',
    render: ({ tipo }: any) => (
      <Badge radius="xs" color={tipo === 'ARMAZEM' ? 'cyan.7' : 'orange.7'}>
        {tipo}
      </Badge>
    ),
  },
  { accessor: 'Localizacao.provincia', title: 'Provincia/Estado' },
  { accessor: 'Localizacao.endereco', title: 'Endereco' },
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
          <Link to={`/instalacoes/actualizar/${record.id}`}>
            <Button compact variant="light" color="blue">
              <IconEdit size={19} />
            </Button>
          </Link>
        </Tooltip>
      </Group>
    ),
  },
];

const rowExpansion = {
  content: ({ record }: any) => (
    <Stack spacing="xs" p="xs">
      <Group ml="md" spacing={6}>
        <Text fw="bold">Descricao:</Text>
        <Text>{record.descricao}</Text>
      </Group>
      <Group>
        <Group ml="md" spacing={6}>
          <Text fw="bold">Cidade:</Text>
          <Text>{record.Localizacao.cidade}</Text>
        </Group>
        <Group ml="md" spacing={6}>
          <Text fw="bold">Código Postal:</Text>
          <Text>{record.Localizacao.codigoPostal}</Text>
        </Group>
      </Group>
    </Stack>
  ),
};

export const InstalacaoList = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('');
  const [codigo, setCodigo] = useState('');

  const onError = (data: any) => {
    showNotification({
      title: <Text fw="bold">Falha na busca dos instalacoes</Text>,
      message: (
        <Text color="dimmed">{data.response.data.message || data.message}</Text>
      ),
      color: 'red',
      autoClose: false,
      icon: <IconExclamationCircle />,
    });
  };

  const rightSection = (
    <Group>
      <Box>
        <Link to={'/instalacoes/cadastrar'}>
          <Button size="xs" leftIcon={<IconPlus size={16} />}>
            Adicionar
          </Button>
        </Link>
      </Box>
    </Group>
  );

  const { data: instalacoes, isLoading } = useInstalacoesData({
    onError,
    filter: { codigo, titulo, tipo },
    page,
    perPage,
  });

  const onFilterSubmit = (e: any) => {
    e.preventDefault();
    setTitulo(e.target.titulo.value.trim());
    setCodigo(e.target.codigo.value.trim());
    setTipo(e.target.tipo.value);
    setPage(1);
  };

  const reset = () => {
    const form: any = document.getElementById('filterInstalacoes');
    form.reset();
    setTitulo('');
    setCodigo('');
    setTipo('');
  };

  const filterForm = (
    <form id="filterInstalacoes" onSubmit={(e) => onFilterSubmit(e)}>
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
          placeholder="Insira o codigo"
        />
        <TextInput
          label="Título"
          variant="filled"
          name="titulo"
          placeholder="Insira o titulo"
        />
        <Select
          label="Tipo"
          variant="filled"
          name="tipo"
          defaultValue={''}
          data={[
            { value: '', label: 'Todos' },
            { value: 'ARMAZEM', label: 'Instalação' },
            { value: 'LOJA', label: 'Loja' },
          ]}
          placeholder="Seleccione o Tipo"
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
      <TitleBar title={'Instalações'} rightSection={rightSection} />
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
            data={instalacoes?.data}
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

export default InstalacaoList;
