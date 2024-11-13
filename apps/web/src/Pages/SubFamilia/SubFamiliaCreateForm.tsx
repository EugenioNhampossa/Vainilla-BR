import {
  Box,
  Button,
  Container,
  Group,
  Paper,
  TextInput,
  Text,
  Textarea,
  Badge,
  Loader,
  Alert,
} from '@mantine/core';
import { TitleBar } from '../../Components/TitleBar';
import * as Yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import {
  IconCheck,
  IconExclamationCircle,
  IconFileDescription,
} from '@tabler/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useAddSubFamiliaData } from '../../hooks/HandleSubFamilia/useAddSubFamilia';
import { useEffect } from 'react';
import { usefetchFamiliaByID } from '../../hooks/HandleFamilia/useGetFamiliaByID';

const schema = Yup.object().shape({
  id_familia: Yup.string(),
  titulo: Yup.string()
    .required('Insira o título')
    .min(2, 'O título deve ter pelo menos 2 caracteres'),
  codigo: Yup.string()
    .required('Insira o código')
    .min(2, 'O código deve ter pelo menos 2 caracteres'),
  descricao: Yup.string(),
});

const SubFamiliaCreateForm = () => {
  const navigate = useNavigate();
  const { idfamilia }: any = useParams();

  const form = useForm({
    validate: yupResolver(schema),
    initialValues: {
      id_familia: '',
      codigo: '',
      titulo: '',
      descricao: '',
    },
    transformValues: (values) => {
      return {
        ...values,
        codigo: values.codigo.trim(),
        titulo: values.titulo.trim(),
        descricao: values.descricao.trim(),
      };
    },
  });

  useEffect(() => {
    form.setValues({
      id_familia: idfamilia,
    });
  }, []);

  const onError = (data: any) => {
    showNotification({
      title: <Text fw="bold">Falha no registro da sub-família</Text>,
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
      message: <Text color="dimmed">Sub-Família Registrada</Text>,
      color: 'green',
      icon: <IconCheck />,
    });
    form.reset();
  };

  const onFamiliaError = (error: Error) => {
    showNotification({
      title: <Text fw="bold">Falha na busca da família seleccionada</Text>,
      message: <Text color="dimmed">{error.message}</Text>,
      color: 'red',
      autoClose: false,
      icon: <IconExclamationCircle />,
    });
  };

  const { data: familia, isLoading: isFamiliaLoading } = usefetchFamiliaByID(
    idfamilia,
    onFamiliaError,
  );

  const { mutate: addSubFamilia, isLoading } = useAddSubFamiliaData(idfamilia);

  const onSubmit = (subfamilia: any) => {
    addSubFamilia(
      { ...subfamilia, codigo: familia?.data?.codigo + subfamilia.codigo },
      {
        onError,
        onSuccess,
      },
    );
  };

  return (
    <>
      <TitleBar title={'Adicionar Sub-Famílias'} />
      <Box m="md">
        <Badge
          mt="xs"
          mr="xs"
          color="teal"
          size="lg"
          radius="xs"
          variant="filled"
        >
          Família:{' '}
          {isFamiliaLoading ? (
            <Loader size="sm" variant="dots" color="#fff" />
          ) : (
            familia?.data?.titulo
          )}
        </Badge>
        <Badge mt="xs" color="teal" size="lg" radius="xs" variant="filled">
          Código:{' '}
          {isFamiliaLoading ? (
            <Loader color="#fff" size="sm" variant="dots" />
          ) : (
            familia?.data?.codigo
          )}
        </Badge>
      </Box>
      {familia?.data?.descricao && (
        <Alert
          color="indigo"
          title="Descrição"
          mt="sm"
          icon={<IconFileDescription />}
        >
          <Text align="justify">{familia?.data?.descricao}</Text>
        </Alert>
      )}
      <Paper shadow="sm">
        <Container my="xl" py={'md'} size={'lg'}>
          <Box sx={{ maxWidth: 500 }} mx="auto">
            <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
              <TextInput
                description="O código gerado pertencerá a sub-familia"
                readOnly
                variant="unstyled"
                label="Código Gerado"
                type="text"
                mt="sm"
                value={familia?.data?.codigo + form.values.codigo}
              />
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
              <Textarea
                label="Descrição"
                variant="filled"
                mt="sm"
                placeholder="Descrição da sub-família..."
                {...form.getInputProps('descricao')}
              />
              <Group position="right" mt="xl">
                <Button
                  onClick={() => {
                    form.reset;
                    navigate(`/familias/${idfamilia}/subfamilias`);
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

export default SubFamiliaCreateForm;
