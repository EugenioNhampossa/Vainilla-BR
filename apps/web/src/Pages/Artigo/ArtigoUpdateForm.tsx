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
  Space,
  Grid,
  Col,
  Stack,
  NumberInput,
  Checkbox,
  Select,
  LoadingOverlay,
} from '@mantine/core';
import { TitleBar } from '../../Components/TitleBar';
import * as Yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { IconBarcode, IconCheck, IconExclamationCircle } from '@tabler/icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SearchableSelect } from '../../Components/AsyncSearchableSelect/SeachableSelect';
import { useFamiliasData } from '../../hooks/HandleFamilia/useFamiliasData';
import { useSubFamiliasData } from '../../hooks/HandleSubFamilia/useSubFamiliasData';
import { useMarcasData } from '../../hooks/HandleMarca/useMarcasData';
import { useEffect, useState } from 'react';
import { usefetchArtigoByID } from '../../hooks/HandleArtigo/useGetArtigoByID';
import { useUpdateArtigoData } from '../../hooks/HandleArtigo/useArtigoUpdate';

const schema = Yup.object().shape({
  id: Yup.string(),
  id_subfamilia: Yup.string().nullable(),
  id_marca: Yup.string().nullable(),
  codigo: Yup.string()
    .required('Insira o código')
    .min(2, 'O título deve ter pelo menos 2 caracteres'),
  titulo: Yup.string()
    .required('')
    .min(2, 'O título deve ter pelo menos 2 caracteres'),
  descricao: Yup.string(),
  taxaIva: Yup.number().typeError('Verifique o preço da pedido'),
  codigoBarras: Yup.string().nullable(),
  unidade: Yup.string(),
});

const ArtigoUpdateForm = () => {
  const { id }: any = useParams();
  const navigate = useNavigate();
  const [renderNumber, setRenderNumber] = useState(0);

  const form = useForm({
    validate: yupResolver(schema),
    initialValues: {
      id: id,
      codigo: '',
      titulo: '',
      descricao: '',
      id_familia: null,
      id_subfamilia: null,
      id_marca: null,
      taxaIva: 0,
      codigoBarras: null,
      unidade: 'uni',
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

  const onErrorFetching = (error: Error) => {
    showNotification({
      title: <Text fw="bold">Falha na busca do artigo seleccionado</Text>,
      message: <Text color="dimmed">{error.message}</Text>,
      color: 'red',
      autoClose: false,
      icon: <IconExclamationCircle />,
    });
  };

  const onError = (data: any) => {
    showNotification({
      title: <Text fw="bold">Falha no registro do artigo</Text>,
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
      message: <Text color="dimmed">Artigo Registrado</Text>,
      icon: <IconCheck />,
    });
    form.reset();
  };

  const { data: artigoData, isLoading: isLoadingData } = usefetchArtigoByID(
    id,
    onErrorFetching,
  );

  useEffect(() => {
    const artigo = artigoData?.data;
    form.setValues({
      id: id,
      codigo: artigo?.codigo,
      titulo: artigo?.titulo,
      descricao: artigo?.descricao,
      id_familia: artigo?.SubFamilia?.Familia.id,
      id_subfamilia: artigo?.id_subfamilia,
      id_marca: artigo?.id_marca,
      taxaIva: parseFloat(artigo?.taxaIva),
      codigoBarras: artigo?.codigoBarras,
      unidade: artigo?.unidade,
    });
  }, [artigoData]);

  const { mutate: updateArtigo, isLoading } = useUpdateArtigoData();

  const onSubmit = (familia: any) => {
    updateArtigo(familia, {
      onError,
      onSuccess,
    });
  };

  function verifyForm() {
    if (!form.isValid()) {
      showNotification({
        title: <Text fw="bold">Dados inválidos</Text>,
        message: (
          <Text color="dimmed">
            Verifique os dados do formulário e tente novamente
          </Text>
        ),
        color: 'red',
        autoClose: false,
        icon: <IconExclamationCircle />,
      });
    }
  }

  useEffect(() => {
    if (renderNumber > 2) {
      form.setFieldValue('id_subfamilia', null);
    }
    setRenderNumber(renderNumber + 1);
  }, [form.values.id_familia]);

  useEffect(() => {
    if (renderNumber > 2) {
      form.setFieldValue('id_modelo', null);
    }
    setRenderNumber(renderNumber + 1);
  }, [form.values.id_marca]);

  return (
    <>
      <TitleBar title={'Actualizar Artigo'} />
      <Paper shadow="sm">
        <Container my="xl" py={'md'} size={'lg'}>
          <Box sx={{ maxWidth: 500 }} mx="auto">
            <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
              <Paper withBorder p="md" sx={{ position: 'relative' }}>
                <LoadingOverlay
                  visible={isLoadingData}
                  zIndex={200}
                  overlayBlur={2}
                />
                <Divider label={<Text fz="sm">Identificação</Text>} />
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
                  placeholder="Descrição do artigo..."
                  {...form.getInputProps('descricao')}
                />
              </Paper>
              <Paper withBorder p="md" mt="md" sx={{ position: 'relative' }}>
                <LoadingOverlay
                  visible={isLoadingData}
                  zIndex={200}
                  overlayBlur={2}
                />
                <Divider mb="sm" label={<Text fz="sm">Classificção</Text>} />
                <Paper withBorder p="sm" mt="sm">
                  <SearchableSelect
                    fetchFuntion={useFamiliasData}
                    name="id_familia"
                    form={form}
                    onErrorMessage="Erro ao buscar as familias"
                    labelText="Família"
                    placeholder="Seleccione a família"
                  />
                  <Space m="xs" />
                  <SearchableSelect
                    fetchFuntion={useSubFamiliasData}
                    idFilter={form.values.id_familia}
                    name="id_subfamilia"
                    form={form}
                    onErrorMessage="Erro ao buscar as subFamilias"
                    labelText="Sub-família"
                    placeholder="Seleccione a sub-família"
                  />
                </Paper>
                <Space m="xs" />
                <Paper withBorder p="sm">
                  <SearchableSelect
                    fetchFuntion={useMarcasData}
                    name="id_marca"
                    form={form}
                    onErrorMessage="Erro ao buscar as marcas"
                    labelText="Marca"
                    placeholder="Seleccione a marca"
                  />
                  <Space m="xs" />
                </Paper>
              </Paper>
              <Paper withBorder p="md" mt="md" sx={{ position: 'relative' }}>
                <LoadingOverlay
                  visible={isLoadingData}
                  zIndex={200}
                  overlayBlur={2}
                />
                <Divider mb="sm" label={<Text fz="sm">Características</Text>} />
                <Stack>
                  <TextInput
                    rightSection={<IconBarcode />}
                    size="sm"
                    variant="filled"
                    color="red"
                    label="Código de Barras"
                    placeholder="Adicione código de barras"
                    {...form.getInputProps('codigoBarras')}
                  />

                  <Grid>
                    <Col span={5}>
                      <NumberInput
                        size="sm"
                        variant="filled"
                        label={'Taxa de IVA'}
                        {...form.getInputProps('taxaIva')}
                      />
                    </Col>
                    <Col span={7}>
                      <TextInput
                        size="sm"
                        variant="filled"
                        disabled
                        label={' '}
                        value={'Taxa de ' + form.values.taxaIva + '%'}
                      />
                    </Col>
                  </Grid>
                  <Grid>
                    <Col lg={6} xs={12}>
                      <Select
                        placeholder="Seleccione a unidade"
                        variant="filled"
                        label="Unidade"
                        data={[
                          { value: 'uni', label: 'uni' },
                          { value: 'g', label: 'g' },
                          { value: 'kg', label: 'kg' },
                          { value: 'cx', label: 'cx' },
                        ]}
                        {...form.getInputProps('unidade')}
                      />
                    </Col>
                  </Grid>
                </Stack>
              </Paper>
              <Group position="right" mt="xl">
                <Button
                  onClick={() => {
                    form.reset;
                    navigate('/artigos');
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
                  onClick={() => verifyForm()}
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

export default ArtigoUpdateForm;
