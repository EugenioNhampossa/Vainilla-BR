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
  Tooltip,
} from '@mantine/core';
import { TitleBar } from '../../Components/TitleBar';
import * as Yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import {
  IconCheck,
  IconExclamationCircle,
  IconFileText,
  IconListDetails,
  IconTableOff,
  IconTrash,
} from '@tabler/icons';
import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { openModal } from '@mantine/modals';
import { TabelaArtigos } from '../../Components/TabelaArtigos';
import { Link, useParams } from 'react-router-dom';
import { useCategoriasData } from '../../hooks/HandleCategoria/useCategoriaData';
import { SearchableSelect } from '../../Components/AsyncSearchableSelect/SeachableSelect';
import { TabelaProdutos } from '../../Components/TabelaProdutos';
import {
  useUpdateCombo,
  useUpdateProdutoSimples,
} from '../../hooks/HandleProduto/useUpdateProduto';
import { usefetchProdutoByID } from '../../hooks/HandleProcucao/useProducaoData';

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
  const { id }: any = useParams();
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

  const { data: produtoData, isLoading, refetch } = usefetchProdutoByID(id);

  const onSuccess = () => {
    showNotification({
      title: <Text fw="bold">Sucesso</Text>,
      message: <Text color="dimmed">Produto actualizado</Text>,
      color: 'green',
      icon: <IconCheck />,
    });
    refetch();
  };

  const { mutate: updateProdutoSimples, isLoading: isLoadingSimples } =
    useUpdateProdutoSimples();

  const onSubmitSimples = (produto: any) => {
    updateProdutoSimples(
      { ...produto, precoCusto: total },
      {
        onError,
        onSuccess,
      },
    );
  };

  const { mutate: updateCombo, isLoading: isLoadingCombo } = useUpdateCombo();

  const onSubmitCombo = (produto: any) => {
    updateCombo(
      { ...produto, precoCusto: total },
      {
        onError,
        onSuccess,
      },
    );
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
    if (form.values.itens) {
      form.values.itens.map((artigo: any) => {
        total += artigo.quantidade * artigo.precoCusto;
      });
    }
    setTotal(total);
  };

  useEffect(() => {
    if (produtoData?.data) {
      setIsCombo(produtoData?.data.isCombo);

      let total = 0;
      let itens = [];
      if (produtoData?.data.isCombo) {
        itens = produtoData?.data.Composto.map((item: any) => {
          return {
            id_item: item.Item.id,
            titulo: item.Item.titulo,
            quantidade: item.quantidade,
            precoCusto: item.Item.precoCusto,
          };
        });
        setTotal(parseFloat(produtoData?.data.precoCusto));
      } else {
        itens = produtoData?.data.Produto_Item.map((item: any) => {
          const preco =
            parseFloat(item.Artigo.valorTotal) /
            parseFloat(item.Artigo.qtyTotal);
          total += preco * parseFloat(item.quantidade);
          return {
            id_item: item.Artigo.id,
            titulo: item.Artigo.titulo,
            quantidade: item.quantidade,
            unidade: item.Artigo.unidade,
            qtyTotal: item.Artigo.qtyTotal,
            valorTotal: item.Artigo.valorTotal,
            precoCusto:
              parseFloat(item.Artigo.valorTotal) /
              parseFloat(item.Artigo.qtyTotal),
          };
        });
        setTotal(total);
      }

      form.setValues({
        id,
        codigo: produtoData?.data.codigo,
        titulo: produtoData?.data.titulo,
        id_categoria: produtoData?.data.Categoria.id,
        preco: parseInt(produtoData?.data.preco),
        itens,
      });
    }
  }, [produtoData]);

  useEffect(() => {
    calculateTotal();
  }, [form.values.itens]);

  const columns_simples = [
    {
      accessor: 'titulo',
      title: 'Artigo',
    },
    {
      accessor: 'quantidade',
      render: (record: any) => (
        <NumberInput
          miw={100}
          maw={120}
          min={0.01}
          step={0.05}
          precision={2}
          defaultValue={parseFloat(record.quantidade)}
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
      render: ({ valorTotal, qtyTotal }: any) => {
        const precoCusto = parseFloat(valorTotal) / parseFloat(qtyTotal);
        return `${precoCusto.toLocaleString('en', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} MT`;
      },
    },
    {
      accessor: 'total',
      title: 'Total',
      render: ({ valorTotal, qtyTotal, quantidade }: any) => {
        const precoCusto = parseFloat(valorTotal) / parseFloat(qtyTotal);
        return `${(precoCusto * parseFloat(quantidade)).toLocaleString('en', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} MT`;
      },
    },
    {
      accessor: 'actions',
      title: <Text mr="xs">Acções</Text>,
      render: (record: any) => (
        <Group spacing={4} noWrap>
          <Tooltip label={'Ficha de ' + record.titulo} position="left">
            <Link to={`/artigos/${record.id_item}`}>
              <ActionIcon size="sm" color="teal.6">
                <IconFileText />
              </ActionIcon>
            </Link>
          </Tooltip>
          <Tooltip label={'Remover'} position="left">
            <ActionIcon
              onClick={() => onRemoveClick(record.id_item)}
              size="sm"
              color="red"
            >
              <IconTrash />
            </ActionIcon>
          </Tooltip>
        </Group>
      ),
    },
  ];
  const columns_combo = [
    { accessor: 'titulo', title: 'Produto' },
    {
      accessor: 'quantidade',
      render: (record: any) => (
        <NumberInput
          miw={100}
          maw={120}
          min={1}
          step={1}
          defaultValue={parseFloat(record.quantidade)}
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
        return `${parseFloat(precoCusto).toLocaleString('en', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} MT`;
      },
    },
    {
      accessor: 'total',
      title: 'Total',
      render: ({ precoCusto, quantidade }: any) => {
        return `${(parseFloat(precoCusto) * parseFloat(quantidade)).toLocaleString('en', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} MT`;
      },
    },
    {
      accessor: 'actions',
      title: <Text mr="xs">Acções</Text>,
      render: (record: any) => (
        <Group spacing={4} noWrap>
          <Tooltip label={'Ver detalhes de ' + record.titulo} position="left">
            <Link to={`/produtos/${record.id_item}/`}>
              <ActionIcon size="sm" color="teal.6" variant="light">
                <IconListDetails />
              </ActionIcon>
            </Link>
          </Tooltip>
          <Tooltip label={'Remover'} position="left">
            <ActionIcon
              onClick={() => onRemoveClick(record.id_item)}
              size="sm"
              color="red"
            >
              <IconTrash />
            </ActionIcon>
          </Tooltip>
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
        defaultValue={total}
        value={total}
        mt="sm"
      />
    </Stack>
  );
  return (
    <>
      <TitleBar title={'Actualizar produto'} rightSection={rightSection} />
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
                disabled={isLoading}
                onClick={
                  produtoData?.data.isCombo
                    ? form.onSubmit((values: any) => onSubmitCombo(values))
                    : form.onSubmit((values: any) => onSubmitSimples(values))
                }
                loading={isLoadingSimples || isLoadingCombo}
              >
                Actualizar dados
              </Button>
            </Group>
          </Container>
        </Paper>
      </Stack>
    </>
  );
};

export default ProdutoCreateForm;
