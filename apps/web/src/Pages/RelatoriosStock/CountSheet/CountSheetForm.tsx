import { Link } from 'react-router-dom';
import { TitleBar } from '../../../Components/TitleBar';
import { Button, Container, Group, NumberInput, Paper } from '@mantine/core';
import { IconList } from '@tabler/icons';
import { Tabela } from '../../../Components/Tabela/Tabela';
import { DatePicker } from '@mantine/dates';
import { useEffect, useState } from 'react';
import { useAddContagem } from '../../../hooks/HandleContagem/useAddContagem';
import { countSheetTemplate } from '../../../templates/count_sheet.template';
import { useGetPdf } from '../../../utils/getPdf';
import { useGetAllItems } from '../../../hooks/HandleArtigo/useArtigosData';

const rightSection = (
  <div>
    <Link to={'/relatorios/stock/count-sheet'}>
      <Button size="xs" leftIcon={<IconList size={16} />}>
        Contagens
      </Button>
    </Link>
  </div>
);

const CountSheetForm = () => {
  const [data, setData] = useState<{
    value: Date | null;
    error: string | null;
  }>({ value: new Date(), error: null });
  const { isLoading: isLoadingPdf, generatePdf } = useGetPdf();
  const { data: artigos, isLoading } = useGetAllItems();
  const [itens, setItens] = useState<
    {
      id_artigo: string;
      qty_preparada: number;
      qty_porPreparar: number;
    }[]
  >();

  useEffect(() => {
    if (!itens?.length) {
      const lista = artigos?.data.map((artigo: any) => {
        return {
          id_artigo: artigo.id,
          qty_preparada: 0,
          qty_porPreparar: 0,
        };
      });
      setItens(lista);
    }
  }, [artigos]);

  const columns = [
    { accessor: 'codigo', title: 'Código' },
    { accessor: 'titulo', title: 'Produto' },
    { accessor: 'unidade', title: 'Unidade' },
    {
      accessor: 'qty_preparada',
      title: 'Qt. Preparada',
      render: ({ id }: any) => (
        <NumberInput
          key={id}
          size="xs"
          maw={120}
          defaultValue={0}
          min={0}
          onChange={(value) => onQtyChange(id, 'preparada', value)}
        />
      ),
    },
    {
      accessor: 'qty_porPreparar',
      title: 'Qt. Por Preparar',
      render: ({ id }: any) => (
        <NumberInput
          key={id}
          size="xs"
          maw={120}
          defaultValue={0}
          min={0}
          onChange={(value) => onQtyChange(id, 'porpreparar', value)}
        />
      ),
    },
  ];

  const onQtyChange = (id: string, tipo: string, qty?: number) => {
    const lista = itens?.map((item) => {
      if (item.id_artigo == id) {
        if (tipo == 'preparada') {
          return { ...item, qty_preparada: qty || 0 };
        } else {
          return { ...item, qty_porPreparar: qty || 0 };
        }
      }
      return item;
    });
    setItens(lista);
  };

  const { mutate, isLoading: isPending } = useAddContagem();

  const submit = () => {
    if (data.value) {
      mutate({ data: data.value?.toISOString(), itens });
    } else {
      setData({ ...data, error: 'Forneça a data da contagem' });
    }
  };

  const handleGetPdf = async () => {
    await generatePdf({
      data: { artigos: artigos?.data },
      fileName: 'countSheet',
      template: countSheetTemplate,
    });
  };

  return (
    <div>
      <TitleBar title={'Stock Count sheet'} rightSection={rightSection} />
      <Paper p="sm" shadow="sm">
        <Group position="apart" py="sm">
          <DatePicker
            label="Data da contagem"
            value={data.value}
            variant="filled"
            onChange={(value) => {
              setData({ ...data, value });
             
            }}
            inputFormat="DD/MM/YYYY"
            error={data.error}
          />
          <Group>
            <Button
              onClick={handleGetPdf}
              size="xs"
              variant="light"
              loading={isLoadingPdf}
            >
              Imprimir tabela
            </Button>
            <Button loading={isPending} size="xs" onClick={submit}>
              Registrar
            </Button>
          </Group>
        </Group>
      </Paper>
      <Paper shadow="sm">
        <Container my="xl" py={'md'} size={'lg'}>
          <Tabela
            onRowClick={() => {}}
            columns={columns}
            data={artigos}
            isLoading={isLoading}
          />
          <Group position="right" py="sm">
            <Button loading={isPending} onClick={submit}>
              Registrar Contagem
            </Button>
          </Group>
        </Container>
      </Paper>
    </div>
  );
};

export default CountSheetForm;
