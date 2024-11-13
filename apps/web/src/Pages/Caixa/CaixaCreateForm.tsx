import {
  Box,
  Button,
  Container,
  Group,
  Paper,
  TextInput,
  Text,
  Textarea,
  Divider,
  Select,
  Loader,
} from '@mantine/core';
import { TitleBar } from '../../Components/TitleBar';
import * as Yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconExclamationCircle } from '@tabler/icons';
import { useNavigate } from 'react-router-dom';
import { useAddCaixaData } from '../../hooks/HandleCaixa/useAddCaixa';
import { useSelectUsuarios } from '../../hooks/HandleUser/useUsers';
import { forwardRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const schema = Yup.object().shape({
  email_usuario: Yup.string().required('Seleccione o usuário responsável'),
  codigo: Yup.string()
    .required('Insira o codigo')
    .min(2, 'O titulo deve ter pelo menos 2 letras'),
  descricao: Yup.string(),
});

const CaixaCreateForm = () => {
  const { user } = useAuth0();
  
  const navigate = useNavigate();
  const form = useForm({
    validate: yupResolver(schema),
    initialValues: {
      email_usuario: '',
      id_instalacao: '',
      codigo: '',
      descricao: '',
    },
    transformValues: (values) => {
      return {
        ...values,
        codigo: values.codigo.trim(),
        descricao: values.descricao.trim(),
      };
    },
  });

  const onError = (data: any) => {
    showNotification({
      title: <Text fw="bold">Falha no registro do Caixa</Text>,
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
      message: <Text color="dimmed">Caixa Registrado</Text>,
      color: 'green',
      icon: <IconCheck />,
    });
    form.reset();
  };

  const { data: usuarios, isLoading: isLoadingUsuarios } = useSelectUsuarios();

  const { mutate: addCaixa, isLoading } = useAddCaixaData();

  const onSubmit = (caixa: any) => {
    addCaixa(
      { ...caixa, id_instalacao: user?.id_instalacao },
      {
        onError,
        onSuccess,
      },
    );
  };

  const SelectItem = forwardRef<HTMLDivElement, any>(
    ({ value, label, description, ...others }: any, ref) => (
      <div ref={ref} {...others}>
        <Group noWrap>
          <Text size="sm">{label}</Text>
          <Text size="xs" opacity={0.65}>
            {value}
          </Text>
        </Group>
      </div>
    ),
  );
  
  return (
    <>
      <TitleBar title={'Adicionar Caixa'} />
      <Paper shadow="sm">
        <Container my="xl" py={'md'} size={'lg'}>
          <Box sx={{ maxWidth: 500 }} mx="auto">
            <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
              <TextInput
                withAsterisk
                variant="filled"
                label="Código"
                placeholder="Insira o código"
                type="text"
                mb="sm"
                {...form.getInputProps('codigo')}
              />
              <Divider my="md" />
              <Select
                variant="filled"
                placeholder="Seleccione um usuário"
                rightSection={isLoadingUsuarios && <Loader size={'xs'} />}
                label="Usuário do caixa"
                description="Escolha o usuário de acordo com a instalação"
                data={usuarios || []}
                itemComponent={SelectItem}
                {...form.getInputProps('email_usuario')}
              />
              <Group position="right" mt="xl">
                <Button
                  onClick={() => {
                    form.reset;
                    navigate('/caixas');
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

export default CaixaCreateForm;
