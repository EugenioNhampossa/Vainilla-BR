import {
  Box,
  Button,
  Container,
  Group,
  Paper,
  Text,
  NumberInput,
  Space,
} from '@mantine/core';
import { TitleBar } from '../../Components/TitleBar';
import * as Yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconExclamationCircle } from '@tabler/icons';
import { useNavigate } from 'react-router-dom';
import { useAddStockData } from '../../hooks/HandleStock/useAddStock';
import { SearchableSelect } from '../../Components/AsyncSearchableSelect/SeachableSelect';
import { useArtigosData } from '../../hooks/HandleArtigo/useArtigosData';
import { useInstalacoesData } from '../../hooks/HandleInstalacao/useInstalacaoData';

const schema = Yup.object().shape({
  id_instalacao: Yup.string().required('Seleccione o Instalação').nullable(),
  id_artigo: Yup.string().required('Seleccione o artigo').nullable(),
  minimo: Yup.number()
    .typeError('Insira um número válido')
    .required('Insira o stock mínimo'),
  maximo: Yup.number()
    .typeError('Insira um número válido')
    .required('Insira o stock maximo'),
  economico: Yup.number()
    .typeError('Insira um número válido')
    .required('Insira o stock económico'),
  reposicao: Yup.number()
    .typeError('Insira um número válido')
    .required('Insira o stock de reposição'),
});

const StockCreateForm = () => {
  const navigate = useNavigate();

  const form = useForm({
    validate: yupResolver(schema),
    initialValues: {
      id_instalacao: '',
      id_artigo: '',
      minimo: 0,
      maximo: 0,
      economico: 0,
      reposicao: 0,
    },
  });

  const onError = (data: any) => {
    showNotification({
      title: <Text fw="bold">Falha no registro dos dados do stock</Text>,
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
      message: <Text color="dimmed">Dados Registrados</Text>,
      color: 'green',
      icon: <IconCheck />,
    });
    form.reset();
  };

  const { mutate: addStock, isLoading } = useAddStockData();

  const onSubmit = (stock: any) => {
    addStock(stock, {
      onError,
      onSuccess,
    });
  };

  return (
    <>
      <TitleBar title={'Adicionar Dados do Stock'} />
      <Paper shadow="sm">
        <Container my="xl" py={'md'} size={'lg'}>
          <Box sx={{ maxWidth: 500 }} mx="auto">
            <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
              <SearchableSelect
                placeholder="Seleccione o artigo"
                fetchFuntion={useArtigosData}
                name="id_artigo"
                form={form}
                onErrorMessage="Erro ao buscar os Artigos"
                labelText="Artigo"
              />
              <Space mb="sm" />
              <SearchableSelect
                placeholder="Seleccione o Instalação"
                fetchFuntion={useInstalacoesData}
                form={form}
                name="id_instalacao"
                onErrorMessage="Erro ao buscar os Instalações"
                labelText="Instalação"
              />
              <NumberInput
                variant="filled"
                label="Qt. Mínima"
                placeholder="Insira a quantidade mínima"
                {...form.getInputProps('minimo')}
                mb="sm"
                mt="sm"
              />
              <NumberInput
                variant="filled"
                label="Qt. Máxima"
                placeholder="Insira a quantidade máxima"
                {...form.getInputProps('maximo')}
                mb="sm"
              />
              <NumberInput
                variant="filled"
                label="Qt. de Reposição"
                placeholder="Insira a quantidade de reposição"
                {...form.getInputProps('reposicao')}
                mb="sm"
              />
              <NumberInput
                variant="filled"
                label="Qt. Económica"
                placeholder="Insira a quantidade económica"
                {...form.getInputProps('economico')}
                mb="sm"
              />
              <Group position="right" mt="xl">
                <Button
                  onClick={() => {
                    form.reset;
                    navigate('/stock');
                  }}
                  variant="outline"
                  color={'red'}
                >
                  Cancelar
                </Button>
                <Button
                  loaderPosition="right"
                  loading={isLoading}
                  type="submit"
                >
                  Registrar
                </Button>
              </Group>
            </form>
          </Box>
        </Container>
      </Paper>
    </>
  );
};

export default StockCreateForm;
