import {
  Box,
  Button,
  Container,
  Group,
  Paper,
  Text,
  Badge,
  SimpleGrid,
  ActionIcon,
  Stack,
  NumberInput,
  Alert,
  TextInput,
  Title,
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

import { SearchableSelect } from '../../Components/AsyncSearchableSelect/SeachableSelect';
import { DataTable } from 'mantine-datatable';
import { useAddCompraData } from '../../hooks/HandleCompra/useAddCompra';
import { useEffect, useState } from 'react';
import { useFornecedoresData } from '../../hooks/HandleFornecedor/useFornecedoresData';
import { openModal } from '@mantine/modals';
import { TabelaArtigos } from '../../Components/TabelaArtigos';
import useScanDetection from '../../utils/useScanDetection';
import { api } from '../../Shared/api';
import { useInstalacoesData } from '../../hooks/HandleInstalacao/useInstalacaoData';
import { notify } from '../../Components/Modals/Notification';

const schema = Yup.object().shape({
  id_fornecedor: Yup.string().required('Insira o fornecedor'),
  id_instalacao: Yup.string().required('Seleccione a instalação'),
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

const CompraCreateForm = () => {
  const [total, setTotal] = useState(0);
  const [totalIva, setTotalIva] = useState(0);
  const [isLoadingArtigo, setIsLoadingArtigo] = useState(false);

  const form: any = useForm({
    validate: yupResolver(schema),
    initialValues: {
      id_fornecedor: '',
      id_instalacao: '',
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
          taxaIva: artigo.taxaIva,
          artigo: artigo.titulo,
          quantidade: 1,
          precoUnit: 0,
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
          taxaIva: artigo.taxaIva,
          artigo: artigo.titulo,
          quantidade: 1,
          precoUnit: 0,
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

  const onError = (data: any) => {
    showNotification({
      title: <Text fw="bold">Falha no registro da compra</Text>,
      message: (
        <Text color="dimmed">{data.response.data.message || data.message}</Text>
      ),
      color: 'red',
      autoClose: false,
      icon: <IconExclamationCircle />,
    });
  };

  const onSuccess = () => {
    showNotification({
      title: <Text fw="bold">Sucesso</Text>,
      message: <Text color="dimmed">Compra Efectuada</Text>,
      color: 'green',
      icon: <IconCheck />,
    });
    form.reset();
    setTotal(0);
    setTotalIva(0);
  };

  const { mutate: addCompra, isLoading } = useAddCompraData();

  const onSubmit = (compra: any) => {
    if (verifyItems(compra)) {
      addCompra(compra, {
        onError,
        onSuccess,
      });
    }
  };

  const verifyItems = (compra: any) => {
    for (let i = 0; i < compra.itens.length; i++) {
      const item = compra.itens[i];
      if (item.precoUnit <= 0) {
        notify({
          type: 'error',
          title: 'Atenção',
          message: `Verifique o preço unitário do artigo ${item.artigo}`,
        });
        return false;
      }
    }
    return true;
  };

  const onQtyChange = (id_artigo: string, valor: number) => {
    const index = form.values.itens.findIndex(
      (artigo: any) => artigo.id_artigo === id_artigo,
    );
    form.values.itens[index].quantidade = valor;
    calculateItemTotal(index);
    calculateTotal();
  };

  const onPUnitChange = (id_artigo: string, valor: number) => {
    const index = form.values.itens.findIndex(
      (artigo: any) => artigo.id_artigo === id_artigo,
    );
    form.values.itens[index].precoUnit = valor;
    calculateItemTotal(index);
    calculateTotal();
  };

  const calculateItemTotal = (index: number) => {
    return (
      form.values.itens[index].precoUnit * form.values.itens[index].quantidade
    );
  };

  const calculateTotal = () => {
    let total = 0;
    let totalIva = 0;
    form.values.itens.map((artigo: any) => {
      total += artigo.quantidade * artigo.precoUnit;
      if (artigo.quantidade && artigo.precoUnit)
        totalIva += total * (artigo.taxaIva / 100);
    });
    setTotal(total);
    setTotalIva(totalIva);
  };

  useEffect(() => {
    calculateTotal();
  }, [form.values.itens]);

  const columns: any = [
    { accessor: 'artigo' },
    { accessor: 'codigoBarras', title: 'Código de Barras' },
    {
      accessor: 'quantidade',
      render: (record: any) => (
        <NumberInput
          miw={100}
          maw={120}
          min={0}
          step={1}
          size="xs"
          noClampOnBlur
          value={record.quantidade}
          placeholder="Quantidade..."
          onChange={(value: any) => onQtyChange(record.id_artigo, value)}
        />
      ),
    },
    {
      accessor: 'precoUnit',
      title: 'Pr.Unitário',
      render: (record: any) => (
        <NumberInput
          miw={100}
          size="xs"
          min={0}
          noClampOnBlur
          value={record.precoUnit}
          placeholder="Preco unit..."
          onChange={(value: any) => onPUnitChange(record.id_artigo, value)}
        />
      ),
    },
    {
      accessor: 'total',
      render: (record: any) => {
        const total = record.quantidade * record.precoUnit;
        if (total) {
          return total.toLocaleString('en-US');
        } else {
          return 0;
        }
      },
    },
    {
      accessor: 'taxaIva',
      title: 'Iva',
      render: (record: any) => {
        return record.taxaIva.toLocaleString('en-US') + ' %';
      },
    },
    {
      accessor: 'Total Liq.',
      title: 'Total Liq.',
      render: (record: any) => {
        const total = record.quantidade * record.precoUnit;
        const totalLiq = total + total * (record.taxaIva / 100);
        if (totalLiq) {
          return parseFloat(totalLiq.toFixed(2)).toLocaleString('en-US');
        } else {
          return 0;
        }
      },
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

  const instalacoes = (
    <SimpleGrid
      cols={2}
      breakpoints={[{ maxWidth: 'xs', cols: 1, spacing: 'sm' }]}
    >
      <SearchableSelect
        placeholder="Seleccione a Instalação"
        fetchFuntion={useInstalacoesData}
        name="id_instalacao"
        form={form}
        onErrorMessage="Erro ao buscar os Instalações"
        labelText="Instalação"
      />
      <Stack>
        <SearchableSelect
          placeholder="Seleccione o fornecedor"
          fetchFuntion={useFornecedoresData}
          name="id_fornecedor"
          form={form}
          onErrorMessage="Erro ao buscar fornecedores"
          labelText="Fornecedor"
        />
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
            Adicionar
          </Button>
        </Group>
      </Stack>
    </SimpleGrid>
  );
  return (
    <>
      <TitleBar title={'Compra'} />

      <Stack>
        <Paper shadow="sm" py="sm">
          <Container size={'lg'}>{instalacoes}</Container>
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
        <SimpleGrid
          cols={3}
          breakpoints={[
            { maxWidth: 'md', cols: 3, spacing: 'lg' },
            { maxWidth: 'sm', cols: 2, spacing: 'md' },
            { maxWidth: 'xs', cols: 1, spacing: 'sm' },
          ]}
        >
          <Paper shadow="sm" p="sm">
            <Stack>
              <Group>
                <Badge radius="xs" size="lg">
                  TOTAL
                </Badge>
              </Group>
              <Title order={2} color="red" ta="right">
                {total
                  ? parseFloat(total.toFixed(2)).toLocaleString('en-US')
                  : 0}{' '}
                {'MT'}
              </Title>
            </Stack>
          </Paper>
          <Paper shadow="sm" p="sm">
            <Stack>
              <Group>
                <Badge radius="xs" size="lg" color="teal">
                  TOTAL IVA
                </Badge>
              </Group>
              <Title order={2} color="red" ta="right">
                {totalIva
                  ? parseFloat(totalIva.toFixed(2)).toLocaleString('en-US')
                  : 0}{' '}
                {'MT'}
              </Title>
            </Stack>
          </Paper>
          <Paper shadow="sm" p="sm">
            <Stack>
              <Group>
                <Badge radius="xs" size="lg" color="orange">
                  TOTAL LIQ
                </Badge>
              </Group>
              <Title order={2} color="red" ta="right">
                {parseFloat((totalIva + total).toFixed(2)).toLocaleString(
                  'en-US',
                )}{' '}
                {'MT'}
              </Title>
            </Stack>
          </Paper>
        </SimpleGrid>
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

export default CompraCreateForm;
