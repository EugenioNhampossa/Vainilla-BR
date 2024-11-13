import { Link, useParams } from 'react-router-dom';
import { usefetchProdutoByID } from '../../hooks/HandleProduto/useProdutosData';
import { useEffect, useState } from 'react';
import { TitleBar } from '../../Components/TitleBar';
import {
  TextInput,
  Text,
  Stack,
  Container,
  Paper,
  Group,
  Tooltip,
  Button,
  Grid,
  NumberInput,
  ActionIcon,
} from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { IconFileText, IconListDetails } from '@tabler/icons';
import { PageLoader } from '../../Components/PageLoader';

const ProdutoInfo = () => {
  const { id }: any = useParams();
  const [produto, setProduto]: any = useState();

  const { data: produtoData, isLoading } = usefetchProdutoByID(id);

  useEffect(() => {
    setProduto(produtoData?.data);
  }, [produtoData]);

  const columns_simples = [
    {
      accessor: 'Artigo.titulo',
      title: 'Artigo',
    },
    {
      accessor: 'quantidade',
      title: 'Quantidade',
    },
    { accessor: 'Artigo.unidade', title: 'Unidade' },
    {
      accessor: 'precoCusto',
      title: 'Preço de Custo',
      render: ({ Artigo }: any) => {
        const precoCusto =
          parseFloat(Artigo.valorTotal) / parseFloat(Artigo.qtyTotal);
        return `${precoCusto.toLocaleString('en', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} MT`;
      },
    },
    {
      accessor: 'total',
      title: 'Total',
      render: ({ Artigo, quantidade }: any) => {
        const precoCusto =
          parseFloat(Artigo.valorTotal) / parseFloat(Artigo.qtyTotal);
        return `${(precoCusto * parseFloat(quantidade)).toLocaleString('en', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} MT`;
      },
    },
    {
      accessor: 'actions',
      title: <Text mr="xs">Acções</Text>,
      render: (record: any) => (
        <Group spacing={4} noWrap>
          <Tooltip label={'Ficha de ' + record.Artigo.titulo} position="left">
            <Link to={`/artigos/${record.Artigo.id}`}>
              <ActionIcon size='sm' variant="light" color="teal.6">
                <IconFileText />
              </ActionIcon>
            </Link>
          </Tooltip>
        </Group>
      ),
    },
  ];
  const columns_combo = [
    { accessor: 'Item.titulo', title: 'Produto' },
    {
      accessor: 'quantidade',
      title: 'Quantidade',
    },
    {
      accessor: 'Item.precoCusto',
      title: 'Preço de Custo',
      render: ({ Item }: any) => {
        return `${parseFloat(Item.precoCusto).toLocaleString('en', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} MT`;
      },
    },
    {
      accessor: 'total',
      title: 'Total',
      render: ({ Item, quantidade }: any) => {
        return `${(parseFloat(Item.precoCusto) * parseFloat(quantidade)).toLocaleString('en', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} MT`;
      },
    },
    {
      accessor: 'actions',
      title: <Text mr="xs">Acções</Text>,
      render: (record: any) => (
        <Group spacing={4} noWrap>
          <Tooltip
            label={'Ver detalhes de ' + record.Item.titulo}
            position="left"
          >
            <Link to={`/produtos/${record.Item.id}/`}>
              <Button compact color="teal" variant="light">
                <IconListDetails size={19} />
              </Button>
            </Link>
          </Tooltip>
        </Group>
      ),
    },
  ];

  const produto_form = (
    <Stack>
      <Text weight="bold" size="sm">
        Dados do Produto
      </Text>
      <TextInput
        variant="filled"
        label="Código"
        type="text"
        mt="sm"
        readOnly
        value={produto?.codigo}
      />
      <TextInput
        variant="filled"
        label="Título"
        type="text"
        mt="sm"
        readOnly
        value={produto?.titulo}
      />
      <TextInput
        variant="filled"
        label="Categoria"
        type="text"
        mt="sm"
        readOnly
        value={produto?.Categoria.titulo}
      />
      <TextInput
        variant="filled"
        label="Quantidade produzida (unidade)"
        type="text"
        mt="sm"
        readOnly
        value={produto?.qtyPorReceita}
      />
      <NumberInput
        variant="filled"
        label="Preço de Venda"
        type="text"
        mt="sm"
        hideControls
        precision={2}
        readOnly
        value={parseFloat(produto?.preco)}
      />
      <NumberInput
        variant="filled"
        label="Preço de Custo"
        type="text"
        mt="sm"
        hideControls
        precision={2}
        readOnly
        value={parseFloat(produto?.precoCusto)}
      />
    </Stack>
  );

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <TitleBar title={'Produto'} />
      <Grid>
        <Grid.Col lg={4} sm={12}>
          <Paper py={'md'} shadow="md">
            <Container>{produto_form}</Container>
          </Paper>
        </Grid.Col>
        <Grid.Col lg={8} sm={12}>
          <Paper py={'md'} shadow="md">
            <DataTable
              striped
              height={550}
              highlightOnHover
              fetching={isLoading}
              columns={produto?.isCombo ? columns_combo : columns_simples}
              records={
                produto?.isCombo ? produto?.Composto : produto?.Produto_Item
              }
            />
          </Paper>
        </Grid.Col>
      </Grid>
    </>
  );
};

export default ProdutoInfo;
