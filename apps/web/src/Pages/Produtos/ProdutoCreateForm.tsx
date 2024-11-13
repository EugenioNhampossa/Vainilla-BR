import {
  Button,
  Container,
  Group,
  Paper,
  Text,
  ActionIcon,
  Stack,
  NumberInput,
  Alert,
  TextInput,
  Select,
  Grid,
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
import { useEffect, useState } from 'react';
import { openModal } from '@mantine/modals';
import { TabelaArtigos } from '../../Components/TabelaArtigos';
import { Link } from 'react-router-dom';
import {
  useAddCombo,
  useAddProdutoSimplesData as useAddProdutoSimples,
} from '../../hooks/HandleProduto/useAddProduto';
import { useCategoriasData } from '../../hooks/HandleCategoria/useCategoriaData';
import { SearchableSelect } from '../../Components/AsyncSearchableSelect/SeachableSelect';
import { TabelaProdutos } from '../../Components/TabelaProdutos';
import { notify } from '../../Components/Modals/Notification';

const schema = Yup.object().shape({
  codigo: Yup.string().required('Insira o codigo'),
  titulo: Yup.string().required('Insira o titulo'),
  id_categoria: Yup.string().required('Seleccione a categoria'),
  qtyPorReceita: Yup.number()
    .optional()
    .min(1, 'A quantidade não deve ser nula'),
  preco: Yup.number().required('Insira o preco de venda'),
  itens: Yup.array()
    .min(1, 'Adicione pelo menos 1 artigo')
    .required('Adicione artigos'),
});

const ProdutoCreateForm = () => {
  const [isLoadingArtigo, setIsLoadinArtigo] = useState(false);
  const [isCombo, setIsCombo] = useState(false);
  const [total, setTotal] = useState(0);

  const form: any = useForm({
    validate: yupResolver(schema),
    initialValues: {
      codigo: '',
      id_categoria: '',
      titulo: '',
      precoCusto: '',
      qtyPorReceita: 1,
      itens: [],
    },
  });

  const rightSection = (
    <div>
      <Link to={'/produtos'}>
        <Button size="xs">Lista de Produtos</Button>
      </Link>
    </div>
  );

  const onRemoveClick = (id_artigo: string) => {
    const itens = form.values.itens.filter(
      (arrayItem: any) => arrayItem.id_item !== id_artigo,
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
    const itens = artigos.map((item: any) => {
      const existing = existingItens.find(
        (existing: any) => existing.id_item === item.id,
      );
      if (!existing) {
        return {
          id_item: item.id,
          titulo: item.titulo,
          quantidade: 1,
          precoCusto: item.precoCusto || item.valorTotal / item.qtyTotal,
          unidade: item.unidade,
        };
      } else {
        return existing;
      }
    });

    form.setFieldValue('itens', itens);

    if (artigos.length) {
      showNotification({
        message: (
          <Text color="dimmed">
            {isCombo ? 'Produto(s) adicionado(s)' : 'Arigo(s) adicionado(s)'}
          </Text>
        ),
        color: 'green',
        autoClose: 1000,
        icon: <IconCheck />,
      });
    }
  };

  const onError = (data: any) => {
    showNotification({
      title: <Text fw="bold">Falha no registro do produto</Text>,
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
      message: <Text color="dimmed">Produto registrado</Text>,
      color: 'green',
      icon: <IconCheck />,
    });
    form.reset();
  };

  const { mutate: addProdutoSimples, isLoading: isLoadingSimples } =
    useAddProdutoSimples();

  const onSubmitSimples = (produto: any) => {
    if (total > 0) {
      addProdutoSimples(
        { ...produto, precoCusto: total },
        {
          onError,
          onSuccess,
        },
      );
    } else {
      notify({
        title: 'Erro',
        message: 'O preço de custo não pode ser nulo',
        type: 'error',
      });
    }
  };

  const { mutate: addCombo, isLoading: isLoadingCombo } = useAddCombo();

  const onSubmitCombo = (produto: any) => {
    if (total > 0) {
      addCombo(
        { ...produto, precoCusto: total },
        {
          onError,
          onSuccess,
        },
      );
    } else {
      notify({
        title: 'Erro',
        message: 'O preço de custo não pode ser nulo',
        type: 'error',
      });
    }
  };

  const onQtyChange = (id_item: string, valor: number) => {
    const index = form.values.itens.findIndex(
      (item: any) => item.id_item === id_item,
    );
    form.values.itens[index].quantidade = valor;
    calculateTotal();
  };

  const calculateTotal = () => {
    let total = 0;
    form.values.itens.map((artigo: any) => {
      total += artigo.quantidade * artigo.precoCusto;
    });
    setTotal(total);
  };

  useEffect(() => {
    calculateTotal();
  }, [form.values.itens]);

  const columns_simples: any = [
    { accessor: 'titulo', title: 'Artigo' },
    {
      accessor: 'quantidade',
      render: (record: any) => (
        <NumberInput
          miw={100}
          maw={120}
          min={0.01}
          step={0.05}
          precision={2}
          defaultValue={1.0}
          size="xs"
          hideControls
          placeholder="Quantidade..."
          onChange={(value: any) => onQtyChange(record.id_item, value)}
        />
      ),
    },
    { accessor: 'unidade', title: 'Unidade' },
    {
      accessor: 'precoCusto',
      title: 'Preço de Custo',
      render: ({ precoCusto }: any) => {
        if (precoCusto > 0) {
          return `${precoCusto.toLocaleString('en', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} MT`;
        } else {
          return '0.00 MT';
        }
      },
    },
    {
      accessor: 'total',
      title: 'Total',
      render: ({ precoCusto, quantidade }: any) => {
        const total = precoCusto * quantidade;
        if (total > 0) {
          return `${total.toLocaleString('en', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} MT`;
        } else {
          return '0.00 MT';
        }
      },
    },
    {
      accessor: 'actions',
      title: <Text mr="xs">Accões</Text>,
      textAlignment: 'right',
      render: (record: any) => (
        <Group spacing={4} position="center" noWrap>
          <ActionIcon color="red" onClick={() => onRemoveClick(record.id_item)}>
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      ),
    },
  ];

  const columns_combo: any = [
    { accessor: 'titulo', title: 'Produto' },
    {
      accessor: 'quantidade',
      render: (record: any) => (
        <NumberInput
          miw={100}
          maw={120}
          min={1}
          step={1}
          defaultValue={1}
          size="xs"
          hideControls
          placeholder="Quantidade..."
          onChange={(value: any) => onQtyChange(record.id_item, value)}
        />
      ),
    },
    {
      accessor: 'precoCusto',
      title: 'Preço de Custo',
      render: ({ precoCusto }: any) => {
        if (precoCusto > 0) {
          return `${precoCusto.toLocaleString('en', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} MT`;
        } else {
          return '0.00 MT';
        }
      },
    },
    {
      accessor: 'total',
      title: 'Total',
      render: ({ precoCusto, quantidade }: any) => {
        const total = precoCusto * quantidade;
        if (total > 0) {
          return `${total.toLocaleString('en', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} MT`;
        } else {
          return '0.00 MT';
        }
      },
    },
    {
      accessor: 'actions',
      title: <Text mr="xs">Accões</Text>,
      textAlignment: 'right',
      render: (record: any) => (
        <Group spacing={4} position="center" noWrap>
          <ActionIcon color="red" onClick={() => onRemoveClick(record.id_item)}>
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      ),
    },
  ];

  const modal_children = () => {
    if (isCombo) return <TabelaProdutos onAddClick={onAddClick} />;
    return <TabelaArtigos onAddClick={onAddClick} />;
  };

  const produto = (
    <Stack>
      <Text weight="bold" size="sm">
        Dados do Produto
      </Text>
      <TextInput
        withAsterisk
        variant="filled"
        label="Código"
        placeholder="Insira o código"
        type="text"
        mt="sm"
        {...form.getInputProps('codigo')}
      />
      <TextInput
        withAsterisk
        variant="filled"
        label="Título"
        placeholder="Insira o Título"
        type="text"
        mt="sm"
        {...form.getInputProps('titulo')}
      />
      <SearchableSelect
        placeholder="Seleccione a Categoria"
        fetchFuntion={useCategoriasData}
        name="id_categoria"
        form={form}
        onErrorMessage="Erro ao buscar as categorias"
        labelText="Categoria"
      />
      <NumberInput
        variant="filled"
        label="Quantidade produzida (unidade)"
        placeholder="Quantidade produzida"
        type="number"
        min={1}
        mt="sm"
        {...form.getInputProps('qtyPorReceita')}
      />
      <NumberInput
        withAsterisk
        variant="filled"
        label="Preço de Venda"
        placeholder="Insira o preço de venda"
        type="number"
        precision={2}
        min={0}
        mt="sm"
        {...form.getInputProps('preco')}
      />
      <NumberInput
        withAsterisk
        variant="filled"
        readOnly
        label="Preço de custo total"
        type="number"
        precision={2}
        min={0}
        value={total}
        mt="sm"
      />
    </Stack>
  );
  return (
    <>
      <TitleBar title={'Produtos'} rightSection={rightSection} />
      <Stack mb="sm">
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
        <Group>
          <Select
            label="Tipo de produto"
            data={[
              { value: 'false', label: 'Produto Simples' },
              { value: 'true', label: 'Combo' },
            ]}
            value={`${isCombo}`}
            onChange={(value) => {
              form.values.itens = [];
              setIsCombo(value == 'true');
            }}
          />
        </Group>
      </Stack>
      <Stack>
        <Grid>
          <Grid.Col lg={4} sm={12}>
            <Paper shadow="sm" py="sm">
              <Container size={'lg'}>{produto}</Container>
            </Paper>
          </Grid.Col>
          <Grid.Col lg={8} sm={12}>
            <Paper shadow="sm" p="sm">
              <Group pb="sm">
                <Button
                  size="xs"
                  onClick={() => {
                    openModal({
                      title: 'Adicione itens',
                      withCloseButton: true,
                      children: modal_children(),
                    });
                  }}
                >
                  {isCombo ? 'Adicionar Produtos' : 'Adicionar Artigos'}
                </Button>
              </Group>
              <DataTable
                striped
                height={500}
                highlightOnHover
                fetching={isLoadingArtigo}
                columns={isCombo ? columns_combo : columns_simples}
                noRecordsText={
                  isCombo ? 'Adicione Produtos' : 'Adicione Artigos'
                }
                noRecordsIcon={<IconTableOff />}
                records={form.values.itens}
              />
            </Paper>
          </Grid.Col>
        </Grid>
        <Paper shadow="sm" py="sm">
          <Container size={'lg'}>
            <Group position="right">
              <Button variant="outline" color="red">
                Cancelar
              </Button>
              <Button
                onClick={
                  isCombo
                    ? form.onSubmit((values: any) => onSubmitCombo(values))
                    : form.onSubmit((values: any) => onSubmitSimples(values))
                }
                loading={isLoadingSimples || isLoadingCombo}
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

export default ProdutoCreateForm;
