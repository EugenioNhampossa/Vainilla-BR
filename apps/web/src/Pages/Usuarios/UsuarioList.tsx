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
  Avatar,
} from '@mantine/core';
import {
  IconEdit,
  IconFilter,
  IconFilterOff,
  IconListDetails,
  IconPlus,
} from '@tabler/icons';
import { TitleBar } from '../../Components/TitleBar';
import { Link } from 'react-router-dom';
import { Tabela } from '../../Components/Tabela/Tabela';
import { useEffect, useState } from 'react';
import { useUsuariosData } from '../../hooks/HandleUser/useUsers';
import { useAuth0 } from '@auth0/auth0-react';

const rightSection = (
  <div>
    <Link to={'/usuarios/cadastrar'}>
      <Button size="xs" leftIcon={<IconPlus size={16} />}>
        Adicionar
      </Button>
    </Link>
  </div>
);

export const UsuarioList = () => {
  const { user } = useAuth0();
  
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [filter, setFilter] = useState({
    nome: '',
    email: '',
  });

  const columns = [
    {
      accessor: 'picure',
      title: '',
      render: ({ picture }: any) => <Avatar src={picture} />,
    },
    { accessor: 'name', title: 'Nome' },
    { accessor: 'email', title: 'Email' },
    {
      accessor: 'actions',
      title: <Text mr="xs">Acções</Text>,
      render: (record: any) => (
        <Group spacing={4} noWrap>
          <Tooltip label={'Editar'} position="left">
            <Link to={`/usuarios/actualizar/${record.id}`}>
              <Button compact variant="light" color="blue">
                <IconEdit size={19} />
              </Button>
            </Link>
          </Tooltip>
          <Tooltip label={'Ver mais informações'} position="left">
            <Link to={`/usuarios/${record.id}`}>
              <Button compact color="teal" variant="light">
                <IconListDetails size={19} />
              </Button>
            </Link>
          </Tooltip>
        </Group>
      ),
    },
  ];

  const onFilterSubmit = (e: any) => {
    e.preventDefault();
    setFilter({
      nome: e.target.nome?.value.trim(),
      email: e.target.email?.value.trim(),
    });
    setPage(1);
  };

  const reset = () => {
    const form: any = document.getElementById('filterUsuarios');
    form.reset();
    setFilter({
      nome: '',
      email: '',
    });
  };

  const { data, isLoading } = useUsuariosData({ filter });

  const filterForm = (
    <form id="filterUsuarios" onSubmit={(e) => onFilterSubmit(e)}>
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
          label="Nome"
          variant="filled"
          name="nome"
          placeholder="Insira o nome"
        />
        <TextInput
          label="Email"
          variant="filled"
          name="email"
          placeholder="Insira o email"
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
      <TitleBar title={'Usuários'} rightSection={rightSection} />
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
            isLoading={isLoading}
            data={{
              data: data?.data.filter(
                (usuario: any) =>
                  user?.id_instalacao === usuario.user_metadata.id_instalacao,
              ),
            }}
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

export default UsuarioList;
