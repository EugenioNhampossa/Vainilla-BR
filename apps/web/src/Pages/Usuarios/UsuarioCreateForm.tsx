import {
  Box,
  Button,
  Container,
  Group,
  Paper,
  TextInput,
  Text,
  Divider,
  Select,
} from '@mantine/core';
import { TitleBar } from '../../Components/TitleBar';
import * as Yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconExclamationCircle } from '@tabler/icons';
import { useNavigate } from 'react-router-dom';
import { useAddUsuarios, useRolesData } from '../../hooks/HandleUser/useUsers';
import { SearchableSelect } from '../../Components/AsyncSearchableSelect/SeachableSelect';
import { useInstalacoesData } from '../../hooks/HandleInstalacao/useInstalacaoData';
import { useAuth0 } from '@auth0/auth0-react';

const schema = Yup.object().shape({
  name: Yup.string()
    .required('Insira o nome')
    .min(2, 'O Nome deve ter pelo menos 2 letras'),
  email: Yup.string().required('Insira o email').email('Email inválido'),
  role: Yup.string().required('Seleccione a funcão'),
  password: Yup.string().required('Insir a password'),
});

const UsuarioCreateForm = () => {
  const { user } = useAuth0();

  const navigate = useNavigate();
  const form = useForm({
    validate: yupResolver(schema),
    initialValues: {
      name: '',
      email: '',
      id_instalacao: user?.id_instalacao,
      password: '',
      role: [],
    },
    transformValues: (values) => {
      return {
        ...values,
        nome: values.name.trim(),
        email: values.email.trim(),
        password: values.password.trim(),
      };
    },
  });

  const onError = (data: any) => {
    showNotification({
      title: <Text fw="bold">Falha no registro do usuário</Text>,
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
      message: <Text color="dimmed">Usuário Registrado</Text>,
      color: 'green',
      icon: <IconCheck />,
    });
    form.reset();
  };

  const { mutate: addUsuario, isLoading } = useAddUsuarios();

  const onSubmit = (usuario: any) => {
    addUsuario(
      { ...usuario, id_instalacao: user?.id_instalacao },
      {
        onError,
        onSuccess,
      },
    );
  };

  const { data: roles } = useRolesData();

  return (
    <>
      <TitleBar title={'Adicionar Usuarios'} />
      <Paper shadow="sm">
        <Container my="xl" py={'md'} size={'lg'}>
          <Box sx={{ maxWidth: 500 }} mx="auto">
            <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
              <TextInput
                withAsterisk
                label="Nome"
                variant="filled"
                type={'text'}
                placeholder="Insira Nome"
                mt="sm"
                {...form.getInputProps('name')}
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
                label="Senha"
                variant="filled"
                mt="sm"
                placeholder="Insira a senha"
                {...form.getInputProps('password')}
              />
              <Divider my="md" />
              <Select
                placeholder="Seleccione a funcão"
                variant="filled"
                label="Função"
                data={roles || []}
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

export default UsuarioCreateForm;
