import { TitleBar } from '../../../Components/TitleBar';
import { Button, Container, Paper, SimpleGrid, Text } from '@mantine/core';
import { Tabela } from '../../../Components/Tabela/Tabela';
import { DatePicker } from '@mantine/dates';
import { useContagem } from '../../../hooks/HandleContagem/useContagemData';
import { useState } from 'react';
import { IconPlus } from '@tabler/icons';
import { Link } from 'react-router-dom';

const columns = [
  { accessor: 'Artigo.codigo', title: 'Código' },
  { accessor: 'Artigo.titulo', title: 'Artigo' },
  { accessor: 'Artigo.unidade', title: 'Unidade' },
  { accessor: 'qty_preparada', title: 'Qt.Preparada' },
  { accessor: 'qty_porPreparar', title: 'Qt.Por Preparar' },
  {
    accessor: 'dataCriacao',
    title: 'Data de Registro',
    render: ({ dataCriacao }: any) => {
      return new Date(dataCriacao).toLocaleDateString();
    },
  },
];

const rightSection = (
  <div>
    <Link to={'/relatorios/stock/count-sheet/registrar'}>
      <Button size="xs" leftIcon={<IconPlus size={16} />}>
        Registrar contagem
      </Button>
    </Link>
  </div>
);

const CountSheet = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [filter, setFilter] = useState<any>({
    data: new Date(),
  });

  const { data: artigos, isLoading } = useContagem({
    filter,
    page,
    perPage,
  });

  return (
    <>
      <TitleBar title={'Stock Count sheet'} rightSection={rightSection} />
      <Paper shadow="sm" p="sm">
        <SimpleGrid
          cols={3}
          breakpoints={[
            { maxWidth: 'md', cols: 3, spacing: 'md' },
            { maxWidth: 'sm', cols: 2, spacing: 'sm' },
            { maxWidth: 'xs', cols: 1, spacing: 'sm' },
          ]}
        >
          <DatePicker
            placeholder="Pesquise pela data"
            variant="filled"
            label="Data de Registro"
            defaultValue={filter?.data}
            onChange={(value) => setFilter({ data: value })}
          />
        </SimpleGrid>
      </Paper>
      <Paper shadow="sm">
        <Container my="xl" py={'md'} size={'lg'}>
          <Tabela
            columns={columns}
            data={artigos?.data.contagem}
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

export default CountSheet;
