import {
  Box,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  ThemeIcon,
  Loader,
  TextInput,
} from '@mantine/core';
import { TitleBar } from '../../Components/TitleBar';
import { useState } from 'react';
import { useGetTotalVendas } from '../../hooks/HandlePedido/usePedidoData';
import { DateRangePicker, DateRangePickerValue } from '@mantine/dates';
import { IconCash } from '@tabler/icons';
import { DataTable } from 'mantine-datatable';
import { useDebouncedValue } from '@mantine/hooks';

const columns = [
  { accessor: 'codigo', title: 'Código' },
  { accessor: 'titulo', title: 'Título' },
  {
    accessor: 'precoVenda',
    title: 'Preço de Venda',
    render: ({ precoVenda }: any) =>
      `${precoVenda.toLocaleString('en', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} MT`,
  },
  { accessor: 'quantidade', title: 'Quantidade' },
  {
    accessor: 'total',
    title: 'Total',
    render: ({ total }: any) =>
      `${total.toLocaleString('en', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} MT`,
  },
  {
    accessor: 'totalDesconto',
    title: 'Total Descontado',
    render: ({ totalDesconto }: any) =>
      `${totalDesconto.toLocaleString('en', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} MT`,
  },
  {
    accessor: 'totalLiquido',
    title: 'Total Líquido',
    render: ({ totalLiquido }: any) =>
      `${totalLiquido.toLocaleString('en', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} MT`,
  },
];

const VendasPorProduto = () => {
  const [codigo, setCodigo] = useDebouncedValue<string | undefined>(
    undefined,
    250,
  );
  const [datas, setDatas] = useState<DateRangePickerValue>([
    new Date(),
    new Date(),
  ]);

  const { data: metricas, isLoading } = useGetTotalVendas({
    codigo,
    datas,
  });

  return (
    <>
      <TitleBar title={'Vendas por Produto'} />
      <SimpleGrid
        cols={3}
        breakpoints={[
          { maxWidth: 'md', cols: 3, spacing: 'md' },
          { maxWidth: 'sm', cols: 2, spacing: 'sm' },
          { maxWidth: 'xs', cols: 1, spacing: 'sm' },
        ]}
        mt={'md'}
      >
        <Paper shadow="lg" p="sm" radius="sm">
          <Stack>
            <Group position="apart">
              <Box c="gray.7" className="text-sm">
                Valor total
              </Box>
              <ThemeIcon color="grape" variant="light">
                <IconCash size={18} />
              </ThemeIcon>
            </Group>
            <Box c="gray.7" className="font-semibold">
              {isLoading ? (
                <Loader size="sm" variant="dots" />
              ) : (
                `${parseFloat(metricas?.data.total).toLocaleString('en', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} MT`
              )}
            </Box>
          </Stack>
        </Paper>
      </SimpleGrid>
      <Paper shadow="sm">
        <Container my="xl" py={'md'} size={'lg'}>
          <Group mb="xs">
            <DateRangePicker
              variant="filled"
              allowSingleDateInRange
              name="datas"
              clearable={false}
              defaultValue={datas}
              onChange={setDatas}
              placeholder="Insira o período de Registro"
            />
            <TextInput
              placeholder="Pesquise pelo código"
              variant="filled"
              onChange={setCodigo}
            />
          </Group>
          <DataTable
            columns={columns}
            height={400}
            records={metricas?.data.pedidos}
            fetching={isLoading}
          />
        </Container>
      </Paper>
    </>
  );
};

export default VendasPorProduto;
