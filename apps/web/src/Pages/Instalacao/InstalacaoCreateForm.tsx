import {
  Box,
  Button,
  Container,
  Group,
  Paper,
  TextInput,
  Text,
  Textarea,
  Select,
  Divider,
} from '@mantine/core';
import { TitleBar } from '../../Components/TitleBar';
import * as Yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconExclamationCircle } from '@tabler/icons';
import { useNavigate } from 'react-router-dom';
import { useAddInstalacaoData } from '../../hooks/HandleInstalacao/useAddInstalacao';
import { useEffect } from 'react';

const schema = Yup.object().shape({
  titulo: Yup.string()
    .required('Insira o título')
    .min(2, 'O título deve ter pelo menos 2 caracteres'),
  tipo: Yup.string().required('Seleccione o Tipo de Instalação'),
  codigo: Yup.string()
    .required('Insira o código')
    .min(2, 'O título deve ter pelo menos 2 caracteres'),
  descricao: Yup.string(),
  provincia: Yup.string().required('Insira a província/estado'),
  cidade: Yup.string().required('Insira a cidade'),
  endereco: Yup.string().required('Insira o endereco'),
  codigoPostal: Yup.string().required('Insira o codigo postal'),
});

const InstalacaoCreateForm = () => {
  const navigate = useNavigate();

  const form = useForm({
    validate: yupResolver(schema),
    initialValues: {
      codigo: '',
      titulo: '',
      tipo: '',
      descricao: '',
      provincia: '',
      cidade: '',
      endereco: '',
      codigoPostal: '',
    },
    transformValues: (values) => {
      return {
        codigo: values.codigo.trim(),
        titulo: values.titulo.trim(),
        tipo: values.tipo.trim(),
        descricao: values.descricao.trim(),
        provincia: values.provincia.trim(),
        cidade: values.cidade.trim(),
        endereco: values.endereco.trim(),
        codigoPostal: values.codigoPostal.trim(),
      };
    },
  });

  const onError = (data: any) => {
    showNotification({
      title: <Text fw="bold">Falha no registro do Instalação</Text>,
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
      message: <Text color="dimmed">Instalação Registrado</Text>,
      color: 'green',
      icon: <IconCheck />,
    });
    form.reset();
  };

  const { mutate: addInstalacao, isLoading } = useAddInstalacaoData();

  const onSubmit = (instalacao: any) => {
    addInstalacao(instalacao, {
      onError,
      onSuccess,
    });
  };

  return (
    <>
      <TitleBar title={'Adicionar Instalações'} />
      <Paper shadow="sm">
        <Container my="xl" py={'md'} size={'lg'}>
          <Box sx={{ maxWidth: 500 }} mx="auto">
            <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
              <Paper withBorder p="xs">
                <Divider mb="sm" label={<Text fz="sm">Identificação</Text>} />
                <TextInput
                  withAsterisk
                  variant="filled"
                  label="Código"
                  placeholder="Insira o código"
                  type="text"
                  mt="sm"
                  {...form.getInputProps('codigo')}
                />
                <TextInput
                  withAsterisk
                  label="Título"
                  variant="filled"
                  type="text"
                  placeholder="Insira o título"
                  mt="sm"
                  {...form.getInputProps('titulo')}
                />
                <Select
                  label="Tipo"
                  variant="filled"
                  name="tipo"
                  data={[
                    { value: 'ARMAZEM', label: 'Armazem' },
                    { value: 'RESTAURANTE', label: 'Restaurante' },
                  ]}
                  placeholder="Seleccione o Tipo"
                  {...form.getInputProps('tipo')}
                />
                <Textarea
                  label="Descrição"
                  variant="filled"
                  mt="sm"
                  placeholder="Descrição do Instalação..."
                  {...form.getInputProps('descricao')}
                />
              </Paper>
              <Paper withBorder p="xs" mt="sm">
                <Divider mb="sm" label={<Text fz="sm">Localização</Text>} />
                <TextInput
                  withAsterisk
                  variant="filled"
                  label="Província/Estado"
                  placeholder="Insira a província/estado"
                  type="text"
                  mt="sm"
                  {...form.getInputProps('provincia')}
                />
                <TextInput
                  withAsterisk
                  label="Cidade"
                  variant="filled"
                  type="text"
                  placeholder="Insira a cidade"
                  mt="sm"
                  {...form.getInputProps('cidade')}
                />
                <TextInput
                  withAsterisk
                  label="Endereco"
                  variant="filled"
                  type="text"
                  placeholder="Insira o endereco"
                  mt="sm"
                  {...form.getInputProps('endereco')}
                />
                <TextInput
                  withAsterisk
                  label="Código postal"
                  variant="filled"
                  type="text"
                  placeholder="Insira o código postal"
                  mt="sm"
                  {...form.getInputProps('codigoPostal')}
                />
              </Paper>
              <Group position="right" mt="xl">
                <Button
                  onClick={() => {
                    form.reset;
                    navigate('/instalacoes');
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

export default InstalacaoCreateForm;
