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
  IconBinaryTree2,
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
import { useProdutosData } from '../../hooks/HandleProduto/useProdutosData';
import { SearchableSelect } from '../../Components/AsyncSearchableSelect/SeachableSelect';
import { useCategoriasData } from '../../hooks/HandleCategoria/useCategoriaData';

const rightSection = (
  <div>
    <Link to={'/produtos/cadastrar'}>
      <Button size="xs" leftIcon={<IconPlus size={16} />}>
        Adicionar
      </Button>
    </Link>
  </div>
);

const columns = [
  { accessor: 'codigo', title: 'Código' },
  { accessor: 'titulo', title: 'Título' },
  {
    accessor: 'isCombo',
    title: 'Tipo',
    render: ({ isCombo }: any) => {
      if (isCombo)
        return (
          <Badge radius="xs" color="blue">
            Combo
          </Badge>
        );
      return (
        <Badge radius="xs" color="orange">
          Simples
        </Badge>
      );
    },
  },
  { accessor: 'Categoria.titulo', title: 'Categoria' },
  {
    accessor: 'preco',
    title: 'Preço de Venda',
    render: ({ preco }: any) => {
      return `${parseInt(preco).toLocaleString('en', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} MT`;
    },
  },
  {
    accessor: 'precoCusto',
    title: 'Preço de Custo',
    render: ({ precoCusto }: any) => {
      return `${parseInt(precoCusto).toLocaleString('en', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} MT`;
    },
  },
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
          <Link to={`/produtos/actualizar/${record.id}`}>
            <Button compact variant="light" color="blue">
              <IconEdit size={19} />
            </Button>
          </Link>
        </Tooltip>
        <Tooltip label={'Ver detalhes de ' + record.titulo} position="left">
          <Link to={`/produtos/${record.id}/`}>
            <Button compact color="teal" variant="light">
              <IconListDetails size={19} />
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

export const ProdutoList = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [titulo, setTitulo] = useState('');
  const [codigo, setCodigo] = useState('');
  const [isCombo, setIsCombo]: any = useState();
  const [id_categoria, setId_categoria] = useState('');

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
  const { data: produtos, isLoading } = useProdutosData({
    onError,
    filter: { codigo, titulo, isCombo, id_categoria },
    page,
    perPage,
  });

  const onFilterSubmit = (e: any) => {
    e.preventDefault();
    setTitulo(e.target.titulo.value.trim());
    setCodigo(e.target.codigo.value.trim());
    setId_categoria(e.target.id_categoria.value);
    setIsCombo(e.target.codigo.isCombo.value);
    setPage(1);
  };

  const reset = () => {
    const form: any = document.getElementById('filterProdutos');
    form.reset();
    setTitulo('');
    setCodigo('');
    setId_categoria('');
    setIsCombo(null);
  };

  const filterForm = (
    <form id="filterProdutos" onSubmit={(e) => onFilterSubmit(e)}>
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
        <SearchableSelect
          placeholder="Seleccione a Categoria"
          initialValue={[]}
          editEnabled={true}
          fetchFuntion={useCategoriasData}
          name="id_categoria"
          onErrorMessage="Erro ao buscar as categorias"
          labelText="Categoria"
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
      <TitleBar title={'Produtos'} rightSection={rightSection} />
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
            data={produtos?.data}
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

export default ProdutoList;
