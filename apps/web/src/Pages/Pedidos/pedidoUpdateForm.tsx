import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { TitleBar } from '../../Components/TitleBar';
import {
  TextInput,
  Text,
  Stack,
  SimpleGrid,
  Container,
  Paper,
} from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { PageLoader } from '../../Components/PageLoader';
import { usefetchPedidoByID } from '../../hooks/HandlePedido/usePedidoData';

const PedidoUpdateForm = () => {
  const { id }: any = useParams();
  const [pedido, setPedido]: any = useState();

  const { data: pedidoData, isLoading } = usefetchPedidoByID(id);

  useEffect(() => {
    setPedido(pedidoData?.data);
  }, [pedidoData]);

  const columns = [
    {
      accessor: 'Produto.titulo',
      title: 'Produto',
    },
    {
      accessor: 'quantidade',
      title: 'Quantidade',
    },
    {
      accessor: 'Produto.preco',
      title: 'Preço',
      render: ({ Produto }: any) => `${parseInt(Produto.preco).toFixed(2)} Mt`,
    },
    {
      accessor: 'desconto',
      render: ({ desconto }: any) => `${parseInt(desconto).toFixed(2)} %`,
    },
    {
      accessor: 'total',
      render: ({ desconto, Produto, quantidade }: any) => {
        const total =
          Produto.preco * quantidade -
          (Produto.preco * quantidade * desconto) / 100;
        return total.toFixed(2);
      },
    },
  ];

  const produto_form = (
    <Stack>
      <Text weight="bold" size="sm">
        Dados do Pedido
      </Text>
      <TextInput
        variant="filled"
        label="Código"
        type="text"
        mt="sm"
        readOnly
        value={pedido?.codigo}
      />
      <TextInput
        variant="filled"
        label="Instalação"
        type="text"
        mt="sm"
        readOnly
        value={pedido?.Caixa.Instalacao.titulo}
      />
      <TextInput
        variant="filled"
        label="Cliente"
        type="text"
        mt="sm"
        readOnly
        value={pedido?.Cliente?.nome || 'Unknown'}
      />
      <TextInput
        variant="filled"
        label="Tipo de Pagamento"
        type="text"
        mt="sm"
        readOnly
        value={pedido?.tipoPagamento}
      />
      <TextInput
        variant="filled"
        label="Desconto"
        type="text"
        mt="sm"
        readOnly
        value={`${parseInt(pedido?.desconto).toFixed(2)} %`}
      />
      <TextInput
        variant="filled"
        label="Data"
        type="text"
        mt="sm"
        readOnly
        value={new Date(pedido?.dataCriacao).toLocaleString()}
      />
    </Stack>
  );

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <TitleBar title={'Actualizar Pedido'} />
      <SimpleGrid
        mt="md"
        cols={2}
        breakpoints={[{ maxWidth: 'xs', cols: 1, spacing: 'sm' }]}
      >
        <Paper py={'md'} shadow="md">
          <Container>{produto_form}</Container>
        </Paper>
        <Paper py={'md'} shadow="md">
          <DataTable
            striped
            highlightOnHover
            fetching={isLoading}
            columns={columns}
            records={pedido?.ItemPedido}
          />
        </Paper>
      </SimpleGrid>
    </>
  );
};

export default PedidoUpdateForm;
