import {
  Box,
  Button,
  Container,
  Group,
  Paper,
  Text,
  LoadingOverlay,
  NumberInput,
  Badge,
  Loader,
} from '@mantine/core';
import { TitleBar } from '../../Components/TitleBar';
import * as Yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconExclamationCircle } from '@tabler/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useUpdateStockData } from '../../hooks/HandleStock/useUpdateStock';
import { usefetchStockByID } from '../../hooks/HandleStock/useGetStockByID';

const schema = Yup.object().shape({
  id: Yup.string(),
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

const StockUpdateForm = () => {
  const { id }: any = useParams();
  const navigate = useNavigate();

  const onErrorFetching = (error: Error) => {
    showNotification({
      title: <Text fw="bold">Falha na busca dos dados seleccionados</Text>,
      message: <Text color="dimmed">{error.message}</Text>,
      color: 'red',
      autoClose: false,
      icon: <IconExclamationCircle />,
    });
  };

  const onUpdateSuccess = () => {
    showNotification({
      title: <Text fw="bold">Sucesso</Text>,
      message: <Text color="dimmed">Dados Actualizados</Text>,
      icon: <IconCheck />,
    });
  };

  const onUpdateError = (data: any) => {
    showNotification({
      title: <Text fw="bold">Falha na busca do stock dos artigos</Text>,
      message: (
        <Text color="dimmed">{data.response.data.message || data.message}</Text>
      ),
      color: 'red',
      autoClose: false,
      icon: <IconExclamationCircle />,
    });
  };

  const form = useForm({
    validate: yupResolver(schema),
    initialValues: {
      id: '',
      id_instalacao: '',
      id_artigo: '',
      minimo: 0,
      maximo: 0,
      economico: 0,
      reposicao: 0,
    },
  });

  const { mutate: updateStock, isLoading, isSuccess } = useUpdateStockData();

  const { data: stock, isLoading: isFetching } = usefetchStockByID(
    id,
    onErrorFetching,
  );

  const onSubmit = (stock: any) => {
    updateStock(stock, {
      onError: onUpdateError,
      onSuccess: onUpdateSuccess,
    });
  };

  useEffect(() => {
    form.setValues({
      id: stock?.data?.id,
      id_instalacao: stock?.data?.id_instalacao,
      id_artigo: stock?.data?.id_artigo,
      minimo: parseFloat(stock?.data?.minimo),
      maximo: parseFloat(stock?.data?.maximo),
      economico: parseFloat(stock?.data?.economico),
      reposicao: parseFloat(stock?.data?.reposicao),
    });
  }, [isFetching]);

  return (
    <>
      <TitleBar title={'Actualizar Dados de stock'} />
      <Box m="md">
        <Badge
          mt="xs"
          mr="xs"
          color="teal"
          size="lg"
          radius="xs"
          variant="filled"
        >
          Instalação:{' '}
          {isFetching ? (
            <Loader size="sm" variant="dots" color="#fff" />
          ) : (
            stock?.data?.Instalacao.titulo
          )}
        </Badge>
        <Badge mt="xs" color="teal" size="lg" radius="xs" variant="filled">
          Artigo:{' '}
          {isFetching ? (
            <Loader color="#fff" size="sm" variant="dots" />
          ) : (
            stock?.data?.Artigo.titulo
          )}
        </Badge>
      </Box>
      <Paper shadow="sm">
        <Container my="xl" py={'md'} size={'lg'}>
          <Box sx={{ maxWidth: 500, position: 'relative' }} mx="auto">
            <LoadingOverlay visible={isFetching} zIndex={200} />
            <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
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
                  Actualizar
                </Button>
              </Group>
            </form>
          </Box>
        </Container>
      </Paper>
    </>
  );
};

export default StockUpdateForm;
