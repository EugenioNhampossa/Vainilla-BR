import {
  Box,
  Button,
  Container,
  Group,
  Paper,
  TextInput,
  Text,
  LoadingOverlay,
  Divider,
  Select,
} from '@mantine/core';
import { TitleBar } from '../../Components/TitleBar';
import * as Yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import { useNavigate, useParams } from 'react-router-dom';
import { IconCheck, IconExclamationCircle, IconTrash } from '@tabler/icons';
import { openConfirmModal } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { useEffect } from 'react';
import { DatePicker } from '@mantine/dates';

const schema = Yup.object().shape({
  primeiroNome: Yup.string()
    .required('Insira o primeiro nome')
    .min(2, 'O Nome deve ter pelo menos 2 letras'),
  ultimoNome: Yup.string()
    .required('Insira o primeiro nome')
    .min(2, 'O Nome deve ter pelo menos 2 letras'),
  dataNasc: Yup.date().required('Insira a data de nascimento'),
  email: Yup.string().required('Insira o email').email('Email inválido'),
  nuit: Yup.string()
    .required('Insira o NUIT')
    .min(9, 'NUIT inválido')
    .matches(/^[0-9]+$/, 'Must be only digits'),
  nrBI: Yup.string().required('Insira o NrBI').min(9, 'NrBI inválido'),
  role: Yup.string().required('Seleccione a funcão'),
  cell1: Yup.string()
    .required('Insira o número de celular')
    .min(9, 'Nr Inválido'),
  cell2: Yup.string(),
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

const UsuarioUpdateForm = () => {
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

  const onErrorFetching = (data: any) => {
    showNotification({
      title: <Text fw="bold">Falha na busca dos usuários</Text>,
      message: (
        <Text color="dimmed">{data.response.data.message || data.message}</Text>
      ),
      color: 'red',
      autoClose: false,
      icon: <IconExclamationCircle />,
    });
  };

  const onUpdateSuccess = () => {
    showNotification({
      title: <Text fw="bold">Sucesso</Text>,
      message: <Text color="dimmed">Dados actualizados</Text>,
      color: 'geen',
      icon: <IconCheck />,
    });
  };

  const onUpdateError = (data: any) => {
    showNotification({
      title: <Text fw="bold">Falha na actualizacao do usuário</Text>,
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
      id:'',
      primeiroNome: '',
      ultimoNome: '',
      dataNasc: new Date(),
      nrBI: '',
      nuit: '',
      email: '',
      cell1: '',
      cell2: '',
      role: '',
    },
    transformValues: (values) => {
      return {
        ...values,
        primeiroNome: values.primeiroNome.trim(),
        ultimoNome: values.ultimoNome.trim(),
        nuit: values.nuit.trim(),
        nrBI: values.nrBI.trim(),
        role: values.role.trim(),
        email: values.email.trim(),
        cell1: values.cell1.trim(),
        cell2: values.cell2.trim(),
      };
    },
  });


  const onSubmit = (usuario: any) => {
    
  };

  const roles = [
    { value: 'SUPERADMIN', label: 'Superadministrador' },
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'CONT', label: 'Contabilista' },
    { value: 'CAIXA', label: 'Caixa' },
  ];

  return (
    <>
      <TitleBar title={'Actualizar Usuário'} rightSection={rightSection} />
      <Paper shadow="sm">
        <Container my="xl" py={'md'} size={'lg'}>
          <Box sx={{ maxWidth: 500, position: 'relative' }} mx="auto">
            <LoadingOverlay visible={false} zIndex={200} />
            <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
              <TextInput
                withAsterisk
                label="Primeiro nome"
                variant="filled"
                type={'text'}
                placeholder="Insira o primeiro nome"
                mt="sm"
                {...form.getInputProps('primeiroNome')}
              />
              <TextInput
                withAsterisk
                label="Ultimo nome"
                variant="filled"
                type={'text'}
                placeholder="Insira o último nome"
                mt="sm"
                {...form.getInputProps('ultimoNome')}
              />
              <DatePicker
                variant="filled"
                mt="sm"
                placeholder="Insira a data de nascimento"
                label="Data de Nascimento"
                {...form.getInputProps('dataNasc')}
              />
              <TextInput
                withAsterisk
                variant="filled"
                label="Nuit"
                placeholder="Insira o nuit"
                type="text"
                mt="sm"
                {...form.getInputProps('nuit')}
              />
              <TextInput
                withAsterisk
                variant="filled"
                label="Nr de BI"
                placeholder="Insira o nr de BI"
                type="text"
                mt="sm"
                {...form.getInputProps('nrBI')}
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
              <Divider my="md" />
              <Select
                placeholder="Seleccione a função"
                variant="filled"
                label="Função"
                data={roles}
                mt="sm"
                {...form.getInputProps('role')}
              />
              <Group position="right" mt="xl">
                <Button
                  onClick={() => {
                    form.reset;
                    navigate('/usuarios');
                  }}
                  variant="outline"
                  color={'red'}
                >
                  Cancelar
                </Button>
                <Button
                  loaderPosition="right"
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

export default UsuarioUpdateForm;
