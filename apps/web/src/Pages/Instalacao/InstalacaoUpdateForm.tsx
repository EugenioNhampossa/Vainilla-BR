import {
  Box,
  Button,
  Container,
  Group,
  Paper,
  TextInput,
  Text,
  Textarea,
  LoadingOverlay,
  Divider,
  Select,
} from '@mantine/core';
import { TitleBar } from '../../Components/TitleBar';
import * as Yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconExclamationCircle, IconTrash } from '@tabler/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { openConfirmModal } from '@mantine/modals';
import { useEffect } from 'react';
import { useUpdateInstalacaoData } from '../../hooks/HandleInstalacao/useUpdateInstalacao';
import { usefetchInstalacaoByID } from '../../hooks/HandleInstalacao/useGetInstalacaoByID';

const schema = Yup.object().shape({
  id: Yup.string(),
  id_localizacao: Yup.string(),
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

const onDeleteClick = () => {
  openConfirmModal({
    title: 'Confirme a exclusão',
    color: 'red',
    children: (
      <>
        <Text fw="bold" size="sm">
          Apagar o Instalação?
        </Text>
        <Text>Todos os dados serão perdidos. Deseja continuar?</Text>
      </>
    ),
    labels: { confirm: 'Apagar', cancel: 'Cancelar' },
    confirmProps: { color: 'red' },
    onCancel: () => console.log('Cancel'),
    onConfirm: () => console.log('Confirmed'),
  });
};

const InstalacaoUpdateForm = () => {
  const { id }: any = useParams();
  const navigate = useNavigate();

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
      title: <Text fw="bold">Falha na busca do Instalação seleccionado</Text>,
      message: <Text color="dimmed">{error.message}</Text>,
      color: 'red',
      autoClose: false,
      icon: <IconExclamationCircle />,
    });
  };

  const onUpdateSuccess = () => {
    showNotification({
      title: <Text fw="bold">Sucesso</Text>,
      message: <Text color="dimmed">Instalação Actualizado</Text>,
      icon: <IconCheck />,
    });
  };

  const onUpdateError = (error: any) => {
    showNotification({
      title: <Text fw="bold">Falha na actualização do Instalação</Text>,
      message: <Text color="dimmed">{error.message}</Text>,
      color: 'red',
      autoClose: false,
      icon: <IconExclamationCircle />,
    });
  };

  const form = useForm({
    validate: yupResolver(schema),
    initialValues: {
      id: id,
      codigo: '',
      titulo: '',
      tipo: '',
      descricao: '',
      id_localizacao: '',
      provincia: '',
      cidade: '',
      endereco: '',
      codigoPostal: '',
    },
    transformValues: (values) => {
      return {
        ...values,
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

  const { mutate: updateInstalacao, isLoading } = useUpdateInstalacaoData();

  const { data: instalacao, isLoading: isLoadingData } =
    usefetchInstalacaoByID(id);

  const onSubmit = (instalacao: any) => {
    updateInstalacao(instalacao, {
      onError: onUpdateError,
      onSuccess: onUpdateSuccess,
    });
  };

  useEffect(() => {
    form.setValues({
      id: instalacao?.data.id,
      codigo: instalacao?.data.codigo,
      titulo: instalacao?.data.titulo,
      descricao: instalacao?.data.descricao,
      tipo: instalacao?.data.tipo,
      id_localizacao: instalacao?.data.Localizacao.id,
      provincia: instalacao?.data.Localizacao.provincia,
      cidade: instalacao?.data.Localizacao.cidade,
      endereco: instalacao?.data.Localizacao.endereco,
      codigoPostal: instalacao?.data.Localizacao.codigoPostal,
    });
  }, [instalacao]);

  return (
    <>
      <TitleBar title={'Actualizar Instalação'} rightSection={rightSection} />
      <Paper shadow="sm">
        <Container my="xl" py={'md'} size={'lg'}>
          <Box sx={{ maxWidth: 500, position: 'relative' }} mx="auto">
            <LoadingOverlay visible={isLoadingData} zIndex={200} />
            <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
              <Paper withBorder p="xs" sx={{ position: 'relative' }}>
                <LoadingOverlay
                  visible={isLoadingData}
                  zIndex={200}
                  overlayBlur={2}
                />
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
                    { value: 'ARMAZEM', label: 'Instalação' },
                    { value: 'LOJA', label: 'Loja' },
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
              <Paper withBorder p="xs" mt="sm" sx={{ position: 'relative' }}>
                <LoadingOverlay
                  visible={isLoadingData}
                  zIndex={200}
                  overlayBlur={2}
                />
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

export default InstalacaoUpdateForm;
