import {
  Box,
  Button,
  Container,
  Group,
  Paper,
  TextInput,
  Text,
  LoadingOverlay,
} from '@mantine/core';
import { TitleBar } from '../../Components/TitleBar';
import * as Yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import { useNavigate, useParams } from 'react-router-dom';
import { IconCheck, IconExclamationCircle, IconTrash } from '@tabler/icons';
import { openConfirmModal } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { usefetchClienteByID } from '../../hooks/HandleCliente/useGetClienteByID';
import { useUpdateClienteData } from '../../hooks/HandleCliente/useUpdateCliente';
import { useEffect } from 'react';

const schema = Yup.object().shape({
  id: Yup.string(),
  nome: Yup.string()
    .required('Insira o nome')
    .min(2, 'O Nome deve ter pelo menos 2 letras'),
  nuit: Yup.string().required('Insira o NUIT'),
  email: Yup.string().email('Email inválido').nullable(),
  cell1: Yup.string().nullable(),
  cell2: Yup.string().nullable(),
});

const onDeleteClick = () => {
  openConfirmModal({
    title: 'Confirme a exclusão',
    color: 'red',
    children: (
      <>
        <Text fw="bold" size="sm">
          Apagar o Cliente?
        </Text>
        <Text>Todos os dados do Cliente serão perdidos. Deseja continuar?</Text>
      </>
    ),
    labels: { confirm: 'Apagar', cancel: 'Cancelar' },
    confirmProps: { color: 'red' },
    onCancel: () => console.log('Cancel'),
    onConfirm: () => console.log('Confirmed'),
  });
};

const ClienteUpdateForm = () => {
  const navigate = useNavigate();
  const { id }: any = useParams();

  const rightSection = (
    <div>
      <Button
        onClick={onDeleteClick}
        size="xs"
        color="red"
        leftIcon={<IconTrash size={16} />}
      >
        Apagar
      </Button>
    </div>
  );

  const onErrorFetching = (error: Error) => {
    showNotification({
      title: <Text fw="bold">Falha na busca do Cliente Seleccionado</Text>,
      message: <Text color="dimmed">{error.message}</Text>,
      color: 'red',
      autoClose: false,
      icon: <IconExclamationCircle />,
    });
  };

  const onUpdateSuccess = () => {
    showNotification({
      title: <Text fw="bold">Sucesso</Text>,
      message: <Text color="dimmed">Cliente Actualizado</Text>,
      color: 'geen',
      icon: <IconCheck />,
    });
  };

  const onUpdateError = (data: any) => {
    showNotification({
      title: <Text fw="bold">Falha na actualização do Cliente</Text>,
      message: (
        <Text color="dimmed">{data.response.data.message || data.message}</Text>
      ),
      color: 'red',
      autoClose: false,
      icon: <IconExclamationCircle />,
    });
  };

  const { mutate: updateCliente, isLoading } = useUpdateClienteData();

  const { data: cliente, isLoading: isFetching } = usefetchClienteByID(
    id,
    onErrorFetching,
  );

  const form = useForm({
    validate: yupResolver(schema),
  });

  useEffect(() => {
    form.setValues({
      id: cliente?.data.id,
      nuit: cliente?.data.nuit,
      nome: cliente?.data.nome,
      email: cliente?.data.email,
      cell1: cliente?.data.cell1 ? cliente?.data.cell1 : null,
      cell2: cliente?.data.cell2 ? cliente?.data.cell2 : null,
    });
  }, [cliente]);

  const onSubmit = (cliente: any) => {
    updateCliente(cliente, {
      onError: onUpdateError,
      onSuccess: onUpdateSuccess,
    });
  };

  return (
    <>
      <TitleBar title={'Actualizar Cliente'} rightSection={rightSection} />
      <Paper shadow="sm">
        <Container my="xl" py={'md'} size={'lg'}>
          <Box sx={{ maxWidth: 500, position: 'relative' }} mx="auto">
            <LoadingOverlay visible={isFetching} zIndex={200} />
            <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
              <TextInput type="hidden" mt="sm" {...form.getInputProps('id')} />
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
                withAsterisk
                label="Email"
                variant="filled"
                type={'email'}
                mt="sm"
                placeholder="example@mail.com"
                {...form.getInputProps('email')}
              />
              <TextInput
                withAsterisk
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

export default ClienteUpdateForm;
