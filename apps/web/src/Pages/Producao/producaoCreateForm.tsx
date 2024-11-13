import {
  Box,
  Button,
  Group,
  Paper,
  Text,
  SimpleGrid,
  ActionIcon,
  Stack,
  NumberInput,
  Alert,
} from '@mantine/core';
import * as Yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import {
  IconCheck,
  IconExclamationCircle,
  IconTableOff,
  IconTrash,
  IconX,
} from '@tabler/icons';

import { SearchableSelect } from '../../Components/AsyncSearchableSelect/SeachableSelect';
import { DataTable } from 'mantine-datatable';
import { openConfirmModal, openModal } from '@mantine/modals';
import { TabelaProdutos } from '../../Components/TabelaProdutos';
import { useInstalacoesData } from '../../hooks/HandleInstalacao/useInstalacaoData';
import { useNavigate } from 'react-router-dom';
import { useAddProducao } from '../../hooks/HandleProcucao/useAddProducao';

const schema = Yup.object().shape({
  id_instalacao: Yup.string().required('Seleccione a instalação'),
  itens: Yup.array()
    .min(1, 'Adicione pelo menos 1 produto')
    .required('Adicione produtos'),
});

const ProducaoCreateForm = () => {
  const navigate = useNavigate();
  const form: any = useForm({
    validate: yupResolver(schema),
    initialValues: {
      id_instalacao: '',
      itens: [],
    },
  });

  const onRemoveClick = (id_produto: string) => {
    const itens = form.values.itens.filter(
      (arrayItem: any) => arrayItem.id_produto !== id_produto,
    );
    form.setFieldValue('itens', itens);
    showNotification({
      message: <Text color="dimmed">Item removido</Text>,
      color: 'red',
      autoClose: 2000,
      icon: <IconTrash />,
    });
  };

  const onAddClick = (produtos: any) => {
    const existingItens = form.values.itens;

    const itens = produtos.map((produto: any) => {
      const existing = existingItens.find(
        (existing: any) => existing.id_produto === produto.id,
      );
      if (!existing) {
        return {
          id_produto: produto.id,
          produto: produto.titulo,
          quantidade: 1,
        };
      } else {
        return existing;
      }
    });

    form.setFieldValue('itens', itens);

    if (produtos.length) {
      showNotification({
        message: <Text color="dimmed">Arigo(s) adicionado(s)</Text>,
        color: 'green',
        autoClose: 1000,
        icon: <IconCheck />,
      });
    }
  };

  const onError = (data: any) => {
    showNotification({
      title: <Text fw="bold">Falha no registro</Text>,
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
      message: <Text color="dimmed">Registrado</Text>,
      color: 'green',
      icon: <IconCheck />,
    });
    form.reset();
    navigate('/producao');
  };

  const { mutate: addProducao, isLoading } = useAddProducao();

  const onSubmit = (producao: any) => {
    addProducao(producao, {
      onError,
      onSuccess,
    });
  };

  const onQtyChange = (id_produto: string, valor: number) => {
    const index = form.values.itens.findIndex(
      (produto: any) => produto.id_produto === id_produto,
    );
    form.values.itens[index].quantidade = valor;
  };

  const columns: any = [
    { accessor: 'produto' },
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
          placeholder="Quantidade..."
          onChange={(value: any) => onQtyChange(record.id_produto, value)}
        />
      ),
    },
    {
      accessor: 'actions',
      title: <Text mr="xs">Accões</Text>,
      textAlignment: 'right',
      render: (record: any) => (
        <Group spacing={4} position="center" noWrap>
          <Button
            variant="light"
            color="red"
            radius={0}
            onClick={() => onRemoveClick(record.id_produto)}
            leftIcon={<IconX />}
          >
            Remover
          </Button>
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
      <Group position="right">
        <Button
          radius={0}
          size="lg"
          onClick={() => {
            openModal({
              title: 'Adicione produtos',
              withCloseButton: true,
              children: <TabelaProdutos onAddClick={onAddClick} />,
              itemID: '000',
            });
          }}
        >
          Adicionar Produtos
        </Button>
      </Group>
    </SimpleGrid>
  );
  return (
    <>
      <Stack>
        <Paper withBorder radius={0} p="sm">
          {instalacoes}
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
        <Paper withBorder radius={0} p="sm">
          <Box h="60vh">
            <DataTable
              striped
              highlightOnHover
              minHeight={150}
              columns={columns}
              noRecordsText="Adicione Produtos"
              noRecordsIcon={<IconTableOff />}
              records={form.values.itens}
            />
          </Box>
        </Paper>
        <Paper withBorder radius={0} p="sm">
          <Group position="right">
            <Button
              size="lg"
              radius={0}
              color="red"
              onClick={() =>
                openConfirmModal({
                  title: 'Atenção!',
                  children: 'Deseja cancelar o registro?',
                  confirmProps: {
                    size: 'lg',
                    children: 'Sim',
                  },
                  cancelProps: {
                    size: 'lg',
                    children: 'Não',
                  },
                  onConfirm: () => {
                    navigate('/producao');
                  },
                })
              }
              loading={isLoading}
            >
              Cancelar
            </Button>

            <Button
              size="lg"
              radius={0}
              color="green"
              onClick={form.onSubmit((values: any) => onSubmit(values))}
              loading={isLoading}
            >
              Registrar
            </Button>
          </Group>
        </Paper>
      </Stack>
    </>
  );
};

export default ProducaoCreateForm;
