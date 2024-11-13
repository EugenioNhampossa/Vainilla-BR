import {
  Button,
  Container,
  Group,
  Paper,
  TextInput,
  Text,
  SimpleGrid,
  MediaQuery,
  Accordion,
  Box,
} from '@mantine/core';
import {
  IconExclamationCircle,
  IconFilter,
  IconFilterOff,
} from '@tabler/icons';
import { TitleBar } from '../../Components/TitleBar';
import { useParams } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { Tabela } from '../../Components/Tabela/Tabela';
import { useState } from 'react';
import { SearchableSelect } from '../../Components/AsyncSearchableSelect/SeachableSelect';
import { useArtigosData } from '../../hooks/HandleArtigo/useArtigosData';
import { usefetchCompraByID } from '../../hooks/HandleCompra/useGetCompraById';

export const CompraInfo = () => {
  const { id }: any = useParams();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const columns = [
    { accessor: 'Artigo.titulo', title: 'Artigo' },
    { accessor: 'quantidade', title: 'Quantidade' },
    { accessor: 'precoUnit', title: 'Preço Unitario' },
  ];

  const { data: compra, isLoading } = usefetchCompraByID(id);

  return (
    <>
      <TitleBar title={'Compra'} />
      <Box m="md">
        <TextInput
          label="Fornecedor"
          variant="filled"
          value={compra?.data.Fornecedor.nome}
        />
      </Box>
      <Paper shadow="sm">
        <Container my="xl" py={'md'} size={'lg'}>
          <Tabela
            columns={columns}
            data={{ data: compra ? compra?.data.ItemCompra : [] }}
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

export default CompraInfo;
