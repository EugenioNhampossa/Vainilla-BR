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
import { useEffect, useState } from 'react';
import { useInstalacoesData } from '../../hooks/HandleInstalacao/useInstalacaoData';
import { SearchableSelect } from '../../Components/AsyncSearchableSelect/SeachableSelect';
import { useCaixasData } from '../../hooks/HandleCaixa/useCaixaData';
import { useUpdateCaixaData } from '../../hooks/HandleCaixa/useUpdateCaixa';

export const CaixaList = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [id_user, setUser] = useState('');
  const [id_instalacao, setInstalacao] = useState('');
  const [codigo, setCodigo] = useState('');

  const onError = (data: any) => {
    showNotification({
      title: <Text fw="bold">Falha na busca dos caixas</Text>,
      message: (
        <Text color="dimmed">{data.response.data.message || data.message}</Text>
      ),
      color: 'red',
      autoClose: false,
      icon: <IconExclamationCircle />,
    });
  };

  const {
    data: caixas,
    isLoading,
    refetch,
  } = useCaixasData({
    onError,
    filter: { codigo, id_user, id_instalacao },
    page,
    perPage,
  });

  const columns = [
    { accessor: 'codigo', title: 'Código' },
    {
      accessor: 'email_usuario',
      title: 'Resposável',
    },
    {
      accessor: 'Instalacao.titulo',
      title: 'Instalação',
    },
    {
      accessor: 'is_open',
      title: 'Estado',
      render: (record: any) => {
        return (
          <Badge
            sx={{ cursor: 'pointer' }}
            color={record.is_open ? 'green' : 'red'}
            radius="sm"
          >
            {record.is_open ? 'Aberto' : 'Fechado'}
          </Badge>
        );
      },
    },
    {
      accessor: 'actions',
      title: <Text mr="xs">Acções</Text>,
      render: (record: any) => (
        <Group spacing={4} noWrap>
          <Tooltip label={'Editar'} position="left">
            <Link to={`/caixas/actualizar/${record.id}`}>
              <Button compact variant="light" color="blue">
                <IconEdit size={19} />
              </Button>
            </Link>
          </Tooltip>
        </Group>
      ),
    },
  ];

  const rightSection = (
    <Group>
      <Box>
        <Link to={'/caixas/cadastrar'}>
          <Button size="xs" leftIcon={<IconPlus size={16} />}>
            Adicionar
          </Button>
        </Link>
      </Box>
    </Group>
  );

  const onFilterSubmit = (e: any) => {
    e.preventDefault();
    setUser(e.target.id_user.value.trim());
    setCodigo(e.target.codigo.value.trim());
    setInstalacao(e.target.id_instalacao.value);
    setPage(1);
  };

  const reset = () => {
    const form: any = document.getElementById('filterCaixas');
    form.reset();
    setUser('');
    setCodigo('');
    setInstalacao('');
  };

  const filterForm = (
    <form id="filterCaixas" onSubmit={(e) => onFilterSubmit(e)}>
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
        <SearchableSelect
          placeholder="Seleccione o Instalação"
          initialValue={[]}
          editEnabled={true}
          fetchFuntion={useInstalacoesData}
          name="id_instalacao"
          onErrorMessage="Erro ao buscar os instalações"
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
      <TitleBar title={'Caixas'} rightSection={rightSection} />
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
            data={caixas?.data}
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

export default CaixaList;
