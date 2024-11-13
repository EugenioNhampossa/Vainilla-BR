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
} from '@mantine/core';
import {
  IconExclamationCircle,
  IconFilter,
  IconListDetails,
  IconPlus,
} from '@tabler/icons';
import { TitleBar } from '../../Components/TitleBar';
import { Link } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { Tabela } from '../../Components/Tabela/Tabela';
import { useState } from 'react';
import { DatePicker } from '@mantine/dates';
import { useCompraData } from '../../hooks/HandleCompra/useCompraData';

const rightSection = (
  <div>
    <Link to={'/compras/cadastrar'}>
      <Button size="xs" leftIcon={<IconPlus size={16} />}>
        Adicionar
      </Button>
    </Link>
  </div>
);

const columns = [
  { accessor: 'Fornecedor.nome', title: 'Fornecedor' },
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
          <Link to={`/compras/${record.id}/itens`}>
            <Button compact color="teal" variant="light">
              <IconListDetails size={19} />
            </Button>
          </Link>
        </Tooltip>
      </Group>
    ),
  },
];

export const CompraList = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [filter, setFilter] = useState<{ data: Date | null }>({
    data: new Date(),
  });

  const { data: compras, isLoading } = useCompraData({
    filter,
    page,
    perPage,
  });

  const filterForm = (
    <>
      <SimpleGrid
        cols={3}
        breakpoints={[
          { maxWidth: 'md', cols: 3, spacing: 'md' },
          { maxWidth: 'sm', cols: 2, spacing: 'sm' },
          { maxWidth: 'xs', cols: 1, spacing: 'sm' },
        ]}
        mb="md"
      >
        <DatePicker
          placeholder="Seleccione a data de registro"
          label="Data de registro"
          variant="filled"
          value={filter.data}
          clearable
          onChange={(value) => setFilter({ data: value })}
        />
      </SimpleGrid>
    </>
  );
  return (
    <>
      <TitleBar title={'Compras'} rightSection={rightSection} />
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
            data={compras?.data}
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

export default CompraList;
