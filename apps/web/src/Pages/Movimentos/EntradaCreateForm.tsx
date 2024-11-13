import {
  Box,
  Button,
  Container,
  Group,
  Paper,
  Text,
  ActionIcon,
  Stack,
  NumberInput,
  Alert,
} from '@mantine/core';
import { TitleBar } from '../../Components/TitleBar';
import * as Yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import {
  IconCheck,
  IconExclamationCircle,
  IconTableOff,
  IconTrash,
} from '@tabler/icons';
import { DataTable } from 'mantine-datatable';
import { useState } from 'react';
import { openModal } from '@mantine/modals';
import { TabelaArtigos } from '../../Components/TabelaArtigos';
import useScanDetection from '../../utils/useScanDetection';
import { api } from '../../Shared/api';
import { useAddEntradaStock } from '../../hooks/HandleEntradaStock/useAddEntradaStock';
import { useAuth0 } from '@auth0/auth0-react';

const schema = Yup.object().shape({
  itens: Yup.array()
    .min(1, 'Adicione pelo menos 1 artigo')
    .required('Adicione artigos'),
});

const onGetArtigoError = (error: Error) => {
  showNotification({
    title: <Text fw="bold">Falha na busca do artigo</Text>,
    message: <Text color="dimmed">{error.message}</Text>,
    color: 'red',
    autoClose: false,
    icon: <IconExclamationCircle />,
  });
};

const EntradaCreateForm = () => {
  const [isLoadingArtigo, setIsLoadingArtigo] = useState(false);

  const { user } = useAuth0();

  const form: any = useForm({
    validate: yupResolver(schema),
    initialValues: {
      itens: [],
    },
  });

  const onRemoveClick = (id_artigo: string) => {
    const itens = form.values.itens.filter(
      (arrayItem: any) => arrayItem.id_artigo !== id_artigo,
    );
    form.setFieldValue('itens', itens);
    showNotification({
      message: <Text color="dimmed">Item removido</Text>,
      color: 'red',
      autoClose: 2000,
      icon: <IconTrash />,
    });
  };

  const onAddClick = (artigos: any) => {
    const existingItens = form.values.itens;
    const itens = artigos.map((artigo: any) => {
      const existing = existingItens.find(
        (existing: any) => existing.id_artigo === artigo.id,
      );
      if (!existing) {
        return {
          id_artigo: artigo.id,
          codigoBarras: artigo.codigoBarras,
          artigo: artigo.titulo,
          quantidade: 1,
        };
      } else {
        return existing;
      }
    });

    form.setFieldValue('itens', itens);

    if (artigos.length) {
      showNotification({
        message: <Text color="dimmed">Arigo(s) adicionado(s)</Text>,
        color: 'green',
        autoClose: 1000,
        icon: <IconCheck />,
      });
    }
  };

  const onScan = (artigo: any) => {
    const existingItens = form.values.itens;
    const existing = existingItens.find(
      (existing: any) => existing.id_artigo === artigo.id,
    );

    if (!existing) {
      form.setFieldValue('itens', [
        ...existingItens,
        {
          id_artigo: artigo.id,
          codigoBarras: artigo.codigoBarras,
          artigo: artigo.titulo,
          quantidade: 1,
        },
      ]);
    }

    if (artigo) {
      showNotification({
        message: <Text color="dimmed">Arigo(s) adicionado(s)</Text>,
        color: 'green',
        autoClose: 1000,
        icon: <IconCheck />,
      });
    }
  };

  const fetchArtigoByCodigoBarras = (codigoBarras: string) => {
    return api.get(`/artigo/codigo/${codigoBarras}`);
  };

  useScanDetection({
    onComplete: async (code) => {
      setIsLoadingArtigo(true);
      const artigo: any = await fetchArtigoByCodigoBarras(
        code.toString(),
      ).catch((error) => onGetArtigoError(error));
      if (artigo.data) {
        onScan(artigo.data);
      } else {
        onGetArtigoError(new Error('Artigo não foi encontrado'));
      }
      setIsLoadingArtigo(false);
    },
  });

  const { mutate: addEntrada, isLoading } = useAddEntradaStock();

  const onSubmit = (entrada: any) => {
    addEntrada(
      { ...entrada, id_instalacao: user?.id_instalacao },
      { onSuccess: () => form.reset() },
    );
  };

  const onQtyChange = (id_artigo: string, valor: number) => {
    const index = form.values.itens.findIndex(
      (artigo: any) => artigo.id_artigo === id_artigo,
    );
    form.values.itens[index].quantidade = valor;
  };

  const columns: any = [
    { accessor: 'artigo' },
    { accessor: 'codigoBarras', title: 'Código de Barras' },
    {
      accessor: 'quantidade',
      render: (record: any) => (
        <NumberInput
          miw={100}
          maw={120}
          min={1}
          step={1}
          precision={2}
          defaultValue={1}
          size="xs"
          placeholder="Quantidade..."
          onChange={(value: any) => onQtyChange(record.id_artigo, value)}
        />
      ),
    },
    {
      accessor: 'actions',
      title: <Text mr="xs">Accões</Text>,
      textAlignment: 'right',
      render: (record: any) => (
        <Group spacing={4} position="center" noWrap>
          <ActionIcon
            color="red"
            onClick={() => onRemoveClick(record.id_artigo)}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      ),
    },
  ];

  return (
    <>
      <TitleBar title={'Entrada de Stock'} />
      <Stack>
        <Paper shadow="sm" p="sm">
          <Group position="right">
            <Button
              onClick={() => {
                openModal({
                  title: 'Adicione artigos',
                  withCloseButton: true,
                  children: <TabelaArtigos onAddClick={onAddClick} />,
                });
              }}
            >
              Adicionar Artigos
            </Button>
          </Group>
        </Paper>
        {form.errors.itens && (
          <Alert
            color="red"
            title="Atenção"
            mt="sm"
            icon={<IconExclamationCircle />}
            mb="sm"
          >
            {form.errors.itens}
          </Alert>
        )}
        <Paper shadow="sm" py="sm">
          <Container size={'lg'}>
            <Box sx={{ height: 374 }}>
              <DataTable
                striped
                highlightOnHover
                minHeight={150}
                fetching={isLoadingArtigo}
                columns={columns}
                noRecordsText="Adicione Artigos"
                noRecordsIcon={<IconTableOff />}
                records={form.values.itens}
              />
            </Box>
          </Container>
        </Paper>
        <Paper shadow="sm" py="sm">
          <Container size={'lg'}>
            <Group position="right">
              <Button
                onClick={form.onSubmit((values: any) => onSubmit(values))}
                loading={isLoading}
              >
                Registrar
              </Button>
            </Group>
          </Container>
        </Paper>
      </Stack>
    </>
  );
};

export default EntradaCreateForm;
