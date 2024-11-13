import { useForm, yupResolver } from '@mantine/form';
import { useAddClienteData } from '../../../hooks/HandleCliente/useAddCliente';
import * as Yup from 'yup';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconExclamationCircle } from '@tabler/icons';
import { Box, Button, Group, TextInput, Text } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';

const schema = Yup.object().shape({
  nome: Yup.string()
    .required('Insira o nome')
    .min(2, 'O Nome deve ter pelo menos 2 letras'),
  nuit: Yup.string().required('Insira o NUIT'),
  email: Yup.string().email('Email inválido').nullable(),
  cell1: Yup.string().nullable(),
  cell2: Yup.string().nullable(),
});

export const NovoCliente = () => {
  const form = useForm({
    initialValues: {
      nome: '',
      nuit: '',
      email: null,
      cell1: null,
      cell2: null,
    },
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
    const createForm: any = document.getElementById('CreateForm');
    createForm.reset();
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
      <Box sx={{ maxWidth: 500 }} mx="auto">
        <form
          id="CreateForm"
          onSubmit={form.onSubmit((values) => onSubmit(values))}
        >
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
                closeAllModals();
              }}
              variant="outline"
              color={'red'}
            >
              Cancelar
            </Button>
            <Button loaderPosition="right" loading={isLoading} type="submit">
              Registrar
            </Button>
          </Group>
        </form>
      </Box>
    </>
  );
};
