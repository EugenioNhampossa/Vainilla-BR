import { TitleBar } from '../../../Components/TitleBar';
import {
  Box,
  Button,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  ThemeIcon,
} from '@mantine/core';
import { DateRangePicker, DateRangePickerValue } from '@mantine/dates';
import { useVariance } from '../../../hooks/HandleContagem/useContagemData';
import { useState } from 'react';
import { useGetPdf } from '../../../utils/getPdf';
import { useAuth0 } from '@auth0/auth0-react';
import { stockVarianceTemplate } from '../../../templates/stock_variance.template';
import { DataTable } from 'mantine-datatable';
import { IconCash, IconTableExport } from '@tabler/icons';

const columns = [
  { accessor: 'codigo', title: 'Código' },
  { accessor: 'titulo', title: 'Produto' },
  { accessor: 'unidade', title: 'Unidade' },
  { accessor: 'stock_inicial', title: 'Stock inicial' },
  { accessor: 'compras', title: 'Compras' },
  { accessor: 'transTotal', title: 'Transf.' },
  { accessor: 'desperdicios', title: 'Desperdicios' },
  { accessor: 'ofertas', title: 'Ofertas' },
  { accessor: 'stock_final', title: 'Stock final' },
  { accessor: 'qtyReal', title: 'Qtd. real usada' },
  { accessor: 'totalPedidos', title: 'Qtd. teórica' },
  { accessor: 'diferenca', title: 'Diferenca' },
  {
    accessor: 'precoCusto',
    title: 'Preço de Custo',
    render: ({ precoCusto }: any) => {
      return `${parseFloat(precoCusto).toLocaleString('en', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} MT`;
    },
  },
  {
    accessor: 'valor',
    title: 'Valor',
    width: '110px',
    render: ({ valor }: any) => {
      return `${parseFloat(valor).toLocaleString('en', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} MT`;
    },
  },
];

const StockVarianceReport = () => {
  const [datas, setDatas] = useState<DateRangePickerValue>([null, null]);
  const { isLoading: isLoadingPdf, generatePdf } = useGetPdf(
    {
      orientation: 'landscape',
    },
    900,
  );

  const { user } = useAuth0();

  const { data: variacao, isLoading } = useVariance({
    datas,
    id_instalacao: user?.id_instalacao,
  });

  const handleGetPdf = async () => {
    await generatePdf({
      data: { artigos: variacao?.data },
      fileName: 'stock-variance',
      template: stockVarianceTemplate,
    });
  };

  return (
    <>
      <TitleBar
        title={'Stock variance report'}
        rightSection={
          <Button
            loading={isLoading || isLoadingPdf}
            size="xs"
            leftIcon={<IconTableExport />}
            onClick={handleGetPdf}
          >
            Exportar
          </Button>
        }
      />
      <SimpleGrid
        cols={3}
        breakpoints={[
          { maxWidth: 'md', cols: 3, spacing: 'md' },
          { maxWidth: 'sm', cols: 2, spacing: 'sm' },
          { maxWidth: 'xs', cols: 1, spacing: 'sm' },
        ]}
      >
        <Paper shadow="lg" p="sm" radius="sm">
          <DateRangePicker
            placeholder="Pesquise pela data"
            variant="filled"
            label={<Box mb="sm">Data de Registro</Box>}
            defaultValue={datas}
            onChange={setDatas}
          />
        </Paper>
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
                `${parseFloat(variacao?.data.totalPerda || 0).toLocaleString('en', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} MT`
              )}
            </Box>
          </Stack>
        </Paper>
      </SimpleGrid>
      <Paper shadow="sm" p="sm" mt="md">
        <DataTable
          columns={columns}
          records={variacao?.data.variacao}
          fetching={isLoading}
          height={400}
        />
      </Paper>
    </>
  );
};

export default StockVarianceReport;
