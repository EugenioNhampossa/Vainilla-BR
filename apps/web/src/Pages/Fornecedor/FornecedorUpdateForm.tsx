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
import { useEffect } from 'react';
import { useUpdateFornecedorData } from '../../hooks/HandleFornecedor/useUpdateFornecedor';
import { usefetchFornecedorByID } from '../../hooks/HandleFornecedor/useGetFornecedorByID';

const schema = Yup.object().shape({
  id: Yup.string(),
  nome: Yup.string().required('Insira o nome'),
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
          Apagar o Fornecedor?
        </Text>
        <Text>
          Todos os dados do Fornecedor serão perdidos. Deseja continuar?
        </Text>
      </>
    ),
    labels: { confirm: 'Apagar', cancel: 'Cancelar' },
    confirmProps: { color: 'red' },
    onCancel: () => console.log('Cancel'),
    onConfirm: () => console.log('Confirmed'),
  });
};

const FornecedorUpdateForm = () => {
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
      title: <Text fw="bold">Falha na busca do Fornecedor Seleccionado</Text>,
      message: <Text color="dimmed">{error.message}</Text>,
      color: 'red',
      autoClose: false,
      icon: <IconExclamationCircle />,
    });
  };

  const onUpdateSuccess = () => {
    showNotification({
      title: <Text fw="bold">Sucesso</Text>,
      message: <Text color="dimmed">Fornecedor Actualizado</Text>,
      color: 'geen',
      icon: <IconCheck />,
    });
  };

  const onUpdateError = (error: any) => {
    showNotification({
      title: <Text fw="bold">Falha na actualização do Fornecedor</Text>,
      message: <Text color="dimmed">{error.message}</Text>,
      color: 'red',
      autoClose: false,
      icon: <IconExclamationCircle />,
    });
  };

  const { mutate: updateFornecedor, isLoading } = useUpdateFornecedorData();

  const { data: fornecedor, isLoading: isFetching } = usefetchFornecedorByID(
    id,
    onErrorFetching,
  );

  const form = useForm({
    validate: yupResolver(schema),
  });

  useEffect(() => {
    form.setValues({
      id: fornecedor?.data.id,
      nuit: fornecedor?.data.nuit,
      nome: fornecedor?.data.nome,
      email: fornecedor?.data.email ? fornecedor?.data.email : null,
      cell1: fornecedor?.data.cell1 ? fornecedor?.data.cell1 : null,
      cell2: fornecedor?.data.cell2 ? fornecedor?.data.cell1 : null,
    });
  }, [fornecedor]);

  const onSubmit = (fornecedor: any) => {
    updateFornecedor(fornecedor, {
      onError: onUpdateError,
      onSuccess: onUpdateSuccess,
    });
  };

  return (
    <>
      <TitleBar title={'Actualizar Fornecedor'} rightSection={rightSection} />
      <Paper shadow="sm">
        <Container my="xl" py={'md'} size={'lg'}>
          <Box sx={{ maxWidth: 500, position: 'relative' }} mx="auto">
            <LoadingOverlay visible={isFetching} zIndex={200} />
            <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
              <TextInput type="hidden" mt="sm" {...form.getInputProps('id')} />
              <TextInput
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
                    navigate('/fornecedores');
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

export default FornecedorUpdateForm;
