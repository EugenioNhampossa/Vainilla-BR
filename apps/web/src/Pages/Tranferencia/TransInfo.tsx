import {
  Container,
  Paper,
  TextInput,
  Text,
  SimpleGrid,
  Badge,
  Box,
} from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons';
import { TitleBar } from '../../Components/TitleBar';
import { useParams } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { Tabela } from '../../Components/Tabela/Tabela';
import { useState } from 'react';
import { usefetchTransByID } from '../../hooks/HandleTransferencia/useGetTransByID';

export const TransList = () => {
  const { id }: any = useParams();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const onTransError = (error: Error) => {
    showNotification({
      title: (
        <Text fw="bold">Falha na busca da transferência seleccionada</Text>
      ),
      message: <Text color="dimmed">{error.message}</Text>,
      color: 'red',
      autoClose: false,
      icon: <IconExclamationCircle />,
    });
  };

  const { data: transferencia, isLoading: isTransLoading } = usefetchTransByID(
    id,
    onTransError,
  );

  const columns = [
    { accessor: 'Artigo.codigo', title: 'Código' },
    { accessor: 'Artigo.codigoBarras', title: 'Código de Barras' },
    { accessor: 'Artigo.titulo', title: 'Título' },
    { accessor: 'quantidade', title: 'Quantidade' },
    { accessor: 'Artigo.unidade', title: 'Unidade' },
  ];

  return (
    <>
      <TitleBar title={'Transferência'} />
      <Box m="md">
        <SimpleGrid
          cols={3}
          breakpoints={[
            { maxWidth: 980, cols: 3, spacing: 'md' },
            { maxWidth: 755, cols: 2, spacing: 'sm' },
            { maxWidth: 600, cols: 1, spacing: 'sm' },
          ]}
        >
          <Box>
            <Badge color="teal" size="lg" radius="xs" variant="filled">
              Partida
            </Badge>
            <TextInput
              readOnly
              variant="filled"
              multiple
              size="sm"
              mt="xs"
              aria-label="estPartida"
              value={transferencia?.data?.Partida.titulo}
            />
          </Box>
          <Box>
            <Badge color="teal" size="lg" radius="xs" variant="filled">
              Destino
            </Badge>
            <TextInput
              readOnly
              variant="filled"
              multiple
              size="sm"
              mt="xs"
              aria-label="estDestino"
              value={transferencia?.data?.Destino.titulo}
            />
          </Box>
          <Box>
            <Badge color="teal" size="lg" radius="xs" variant="filled">
              Data
            </Badge>
            <TextInput
              readOnly
              variant="filled"
              multiple
              size="sm"
              mt="xs"
              aria-label="título"
              value={new Date(transferencia?.data.dataCriacao).toLocaleString(
                'pt',
              )}
            />
          </Box>
        </SimpleGrid>
      </Box>
      <Paper shadow="sm">
        <Container my="xl" py={'md'} size={'lg'}>
          <Tabela
            columns={columns}
            data={{ data: transferencia?.data.Item }}
            isLoading={isTransLoading}
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
