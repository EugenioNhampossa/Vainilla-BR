import {
  Box,
  Button,
  Container,
  Paper,
  TextInput,
  Text,
  Textarea,
  Divider,
  Space,
  Stack,
  Select,
  Modal,
} from '@mantine/core';
import { TitleBar } from '../../Components/TitleBar';
import * as Yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { IconBarcode, IconExclamationCircle } from '@tabler/icons';
import { useNavigate } from 'react-router-dom';
import { SearchableSelect } from '../../Components/AsyncSearchableSelect/SeachableSelect';
import { useFamiliasData } from '../../hooks/HandleFamilia/useFamiliasData';
import { useSubFamiliasData } from '../../hooks/HandleSubFamilia/useSubFamiliasData';
import { useMarcasData } from '../../hooks/HandleMarca/useMarcasData';
import { useEffect, useState } from 'react';
import { useAddArtigoData } from '../../hooks/HandleArtigo/useAddArtigo';
import { SelectFamilyInput } from '../../Components/SelectFamilySearchableSelect/SelectFamilyInput';

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

const ArtigoCreateForm = () => {
  const navigate = useNavigate();

  const form = useForm({
    validate: yupResolver(schema),
    initialValues: {
      id: '',
      codigo: '',
      titulo: '',
      descricao: '',
      id_tipo: null,
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

  const [createFamilyModal, setCreateFamilyModal] = useState(false);

  const { mutate: addArtigo, isLoading } = useAddArtigoData();

  const onSubmit = (familia: any) => {
    addArtigo(familia);
  };

  const handleNewOptionSelect = () => {
    console.log('new chosen');
    setCreateFamilyModal(true); // Open the modal
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
    form.setFieldValue('id_subfamilia', null);
  }, [form.values.id_familia]);

  useEffect(() => {
    form.setFieldValue('id_modelo', null);
  }, [form.values.id_marca]);

  return (
    <>
      <TitleBar title={'Adicionar Artigos'} />
      <Paper shadow="sm">
        <Container my="xl" py={'md'} size={'lg'}>
          <Box sx={{ maxWidth: 500 }} mx="auto">
            <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
              {/* Identification */}
              <Paper withBorder p="md">
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

              {/* Classification */}
              <Paper withBorder p="md" mt="md">
                <Divider mb="sm" label={<Text fz="sm">Classificação</Text>} />
                <Paper withBorder p="sm" mt="sm">
                  <SelectFamilyInput
                    fetchFuntion={useFamiliasData}
                    name="id_familia"
                    form={form}
                    onErrorMessage="Erro ao buscar as familias"
                    labelText="Família"
                    placeholder="Seleccione a família"
                    onNewOptionSelect={handleNewOptionSelect}
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
                    onNewOptionSelect={handleNewOptionSelect} // Link to handleNewOptionSelect
                  />
                </Paper>
              </Paper>

              {/* Characterisitics */}
              <Paper withBorder p="md" mt="md">
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

                  <Stack spacing={'xs'}>
                    <TextInput
                      size="sm"
                      variant="filled"
                      label="Unidade"
                      placeholder="Adicione a unidade"
                      {...form.getInputProps('unidade')}
                    />
                    <TextInput
                      size="sm"
                      label="Taxa de IVA"
                      placeholder="Adicione a taxa de IVA"
                      {...form.getInputProps('taxaIva')}
                    />
                  </Stack>
                </Stack>
              </Paper>

              <Button
                type="submit"
                fullWidth
                mt="md"
                loading={isLoading}
                onClick={verifyForm}
              >
                Guardar
              </Button>
            </form>
          </Box>
        </Container>
      </Paper>

      {/* Create Family Modal */}
      <Modal
        opened={createFamilyModal}
        onClose={() => setCreateFamilyModal(false)}
        title="Criar Nova Família"
      >
        {/* Modal content for creating a new family */}
      </Modal>
    </>
  );
};

export default ArtigoCreateForm;
