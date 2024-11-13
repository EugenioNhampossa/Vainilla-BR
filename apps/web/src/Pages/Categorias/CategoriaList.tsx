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
import { Tabela } from '../../Components/Tabela/Tabela';
import { useState } from 'react';
import { useCategoriasData } from '../../hooks/HandleCategoria/useCategoriaData';

const rightSection = (
  <div>
    <Link to={'/categorias/cadastrar'}>
      <Button size="xs" leftIcon={<IconPlus size={16} />}>
        Adicionar
      </Button>
    </Link>
  </div>
);

const columns = [
  { accessor: 'codigo', title: 'Código' },
  { accessor: 'titulo', title: 'Título' },
  { accessor: '_count.Produto', title: 'Nr. Produtos' },
  {
    accessor: 'actions',
    title: <Text mr="xs">Acções</Text>,
    render: (record: any) => (
      <Group spacing={4} noWrap>
        <Tooltip label={'Editar ' + record.titulo} position="left">
          <Link to={`/categorias/actualizar/${record.id}`}>
            <Button compact variant="light" color="blue">
              <IconEdit size={19} />
            </Button>
          </Link>
        </Tooltip>
      </Group>
    ),
  },
];

export const CategoriaList = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [titulo, setTitulo] = useState('');
  const [codigo, setCodigo] = useState('');
  const {
    data: categorias,
    isLoading,
  } = useCategoriasData({ filter: { codigo, titulo }, page, perPage });

  const onFilterSubmit = (e: any) => {
    e.preventDefault();
    setTitulo(e.target.titulo.value.trim());
    setCodigo(e.target.codigo.value.trim());
    setPage(1);
  };

  const reset = () => {
    const form: any = document.getElementById('filterCategorias');
    form.reset();
    setTitulo('');
    setCodigo('');
  };

  const filterForm = (
    <form id="filterCategorias" onSubmit={(e) => onFilterSubmit(e)}>
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
      <TitleBar title={'Categorias'} rightSection={rightSection} />
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
            data={categorias?.data}
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

export default CategoriaList;
