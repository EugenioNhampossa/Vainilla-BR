import {
  Box,
  Button,
  Container,
  Group,
  Paper,
  TextInput,
  Text,
} from '@mantine/core';
import { TitleBar } from '../../Components/TitleBar';
import * as Yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconExclamationCircle } from '@tabler/icons';
import { useAddClienteData } from '../../hooks/HandleCliente/useAddCliente';
import { useNavigate } from 'react-router-dom';

const schema = Yup.object().shape({
  nome: Yup.string()
    .required('Insira o nome')
    .min(2, 'O Nome deve ter pelo menos 2 letras'),
  nuit: Yup.string().required('Insira o NUIT'),
  email: Yup.string().email('Email inválido').nullable(),
  cell1: Yup.string().nullable(),
  cell2: Yup.string().nullable(),
});

const ClienteCreateForm = () => {
  const navigate = useNavigate();

  const form = useForm({
    validate: yupResolver(schema),
  });

  const onError = (data: any) => {
    showNotification({
      title: <Text fw="bold">Falha no registro do cliente</Text>,
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
      message: <Text color="dimmed">Cliente Registrado</Text>,
      color: 'green',
      icon: <IconCheck />,
    });
    form.reset();
  };

  const { mutate: addCliente, isLoading } = useAddClienteData();

  const onSubmit = (cliente: any) => {
    addCliente(cliente, {
      onError,
      onSuccess,
    });
  };

  return (
    <>
      <TitleBar title={'Adicionar Clientes'} />
      <Paper shadow="sm">
        <Container my="xl" py={'md'} size={'lg'}>
          <Box sx={{ maxWidth: 500 }} mx="auto">
            <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
              <TextInput
                withAsterisk
                variant="filled"
                label="Nuit"
                placeholder="Nuit"
                type="text"
                mt="sm"
                {...form.getInputProps('nuit')}
              />
              <TextInput
                withAsterisk
                label="Nome"
                variant="filled"
                type={'text'}
                placeholder="Nome completo"
                mt="sm"
                {...form.getInputProps('nome')}
              />
              <TextInput
                label="Email"
                variant="filled"
                type={'email'}
                mt="sm"
                placeholder="example@mail.com"
                {...form.getInputProps('email')}
              />
              <TextInput
                label="Celular"
                type={'tel'}
                variant="filled"
                mt="sm"
                placeholder="+258"
                {...form.getInputProps('cell1')}
              />
              <TextInput
                label="Celular Alternativo"
                variant="filled"
                type={'tel'}
                mt="sm"
                placeholder="+258"
                {...form.getInputProps('cell2')}
              />
              <Group position="right" mt="xl">
                <Button
                  onClick={() => {
                    form.reset;
                    navigate('/clientes');
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

export default ClienteCreateForm;
