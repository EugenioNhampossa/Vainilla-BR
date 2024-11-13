import {
  Alert,
  Badge,
  Box,
  Button,
  Checkbox,
  Col,
  Container,
  Divider,
  Grid,
  Group,
  LoadingOverlay,
  Paper,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  TextInput,
} from '@mantine/core';
import {
  IconBarcode,
  IconExclamationCircle,
  IconFileDescription,
  IconPrinter,
  IconTrash,
} from '@tabler/icons';
import { Link, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import { TitleBar } from '../../Components/TitleBar';
import { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { usefetchArtigoByID } from '../../hooks/HandleArtigo/useGetArtigoByID';
import { SearchableSelect } from '../../Components/AsyncSearchableSelect/SeachableSelect';
import { useInstalacoesData } from '../../hooks/HandleInstalacao/useInstalacaoData';
import { useGetStockByArtigo } from '../../hooks/HandleStock/useGetStockByArtigo';
import { usePDF } from '@react-pdf/renderer';
import { useQueryClient } from 'react-query';

const onError = (data: any) => {
  showNotification({
    title: <Text fw="bold">Falha na busca dos dados</Text>,
    message: (
      <Text color="dimmed">
        {data.response.data.message[0] || data.message}
      </Text>
    ),
    color: 'red',
    autoClose: false,
    icon: <IconExclamationCircle />,
  });
};

const schema = Yup.object().shape({
  id_instalacao: Yup.string(),
});

const ArtigoInfo = () => {
  const { id }: any = useParams();
  const queryClient = useQueryClient();
  const [artigo, setArtigo]: any = useState();
  const { data: artigoData, isLoading } = usefetchArtigoByID(id, onError);

  useEffect(() => {
    setArtigo(artigoData?.data);
  }, [artigoData]);

  const form = useForm({
    validate: yupResolver(schema),
    initialValues: {
      id_instalacao: 'id',
    },
  });

  const { data: stock, isLoading: isLoadingStock } = useGetStockByArtigo({
    onError,
    filter: { id_instalacao: form.values.id_instalacao, id_artigo: id },
  });

  const subfamiliaForm = (
    <Stack sx={{ position: 'relative' }}>
      <LoadingOverlay visible={isLoading} overlayBlur={2} zIndex={200} />
      <Box>
        <Badge radius="xs" size="lg" color="green">
          Família/Sub-Família
        </Badge>
      </Box>
      <Divider my="xs" label="Família" />
      <Grid>
        <Col lg={4} xs={12}>
          <TextInput
            readOnly
            variant="filled"
            size="sm"
            label="Código"
            value={artigo?.SubFamilia?.Familia.codigo}
          />
        </Col>
        <Col lg={8} xs={12}>
          <TextInput
            readOnly
            variant="filled"
            size="sm"
            label="Título"
            placeholder="Nenhuma família atribuida"
            value={artigo?.SubFamilia?.Familia.titulo}
          />
        </Col>
      </Grid>
      <Divider my="xs" label="Sub-Família" />
      <Grid>
        <Col lg={4} xs={12}>
          <TextInput
            readOnly
            variant="filled"
            size="sm"
            label="Código"
            value={artigo?.SubFamilia?.codigo}
          />
        </Col>
        <Col lg={8} xs={12}>
          <TextInput
            readOnly
            variant="filled"
            size="sm"
            label="Título"
            placeholder="Nenhuma sub-família atribuída"
            value={artigo?.SubFamilia?.Familia.codigo}
          />
        </Col>
      </Grid>
    </Stack>
  );

  const caracteristicasForm = (
    <Stack sx={{ position: 'relative' }}>
      <LoadingOverlay visible={isLoading} overlayBlur={2} zIndex={200} />
        <Badge radius="xs" size="lg" color="red">
          Características
        </Badge>
      <TextInput
        readOnly
        variant="filled"
        size="sm"
        label="Código de Barras"
        placeholder="Nenhum código de barras atribuído"
        rightSection={<IconBarcode />}
        value={artigo?.codigoBarras}
      />
      <Grid>
        <Col span={5}>
          <TextInput
            readOnly
            variant="filled"
            size="sm"
            label="Taxa de IVA (%)"
            value={artigo?.taxaIva}
          />
        </Col>
        <Col span={7}>
          <TextInput
            size="sm"
            variant="filled"
            disabled
            label={' '}
            value={'Taxa de ' + artigo?.taxaIva + '%'}
          />
        </Col>
      </Grid>
      <Grid>
        <Col lg={6} xs={12}>
          <TextInput
            readOnly
            variant="filled"
            size="sm"
            label="Unidade"
            value={artigo?.unidade}
          />
        </Col>
      </Grid>
    </Stack>
  );

  const stockForm = (
    <Stack sx={{ position: 'relative' }}>
      <LoadingOverlay
        visible={isLoading || isLoadingStock}
        overlayBlur={2}
        zIndex={200}
      />
      <Box>
        <Badge radius="xs" size="lg" color="gray">
          Stock
        </Badge>
      </Box>
      <Box>
        <SearchableSelect
          placeholder="Seleccione o Instalação"
          fetchFuntion={useInstalacoesData}
          name="id_instalacao"
          onErrorMessage="Erro ao buscar os Instalações"
          labelText="Instalação"
          form={form}
        />
      </Box>
      <Box mt="md">
        <TextInput
          size="sm"
          variant="filled"
          value={stock?.data?.actual ? stock?.data?.actual : '0'}
          label="Actual"
        />
      </Box>
      <Box mt="md">
        <Grid>
          <Col lg={6} xs={12}>
            <TextInput
              size="sm"
              variant="filled"
              value={stock?.data?.minimo ? stock?.data?.minimo : '0'}
              label="Stock mínimo"
            />
          </Col>
          <Col lg={6} xs={12}>
            <TextInput
              size="sm"
              variant="filled"
              value={stock?.data?.maximo ? stock?.data?.maximo : '0'}
              label="Stock máximo"
            />
          </Col>
        </Grid>
      </Box>
    </Stack>
  );

  const rightSection = (
    <div>
      <Button color="red" size="xs" leftIcon={<IconTrash size={16} />}>
        Apagar
      </Button>
    </div>
  );

  return (
    <>
      <TitleBar title={'Ficha do Artigo'} rightSection={rightSection} />
      <Box m="md">
        <Grid>
          <Col md={6} xs={12}>
            <Badge color="teal" size="lg" radius="xs" variant="filled">
              Código
            </Badge>
            <TextInput
              readOnly
              variant="filled"
              multiple
              size="sm"
              mt="xs"
              aria-label="Código"
              value={artigo?.codigo}
            />
          </Col>
          <Col md={6} xs={12}>
            <Badge color="teal" size="lg" radius="xs" variant="filled">
              Título
            </Badge>
            <TextInput
              readOnly
              variant="filled"
              multiple
              size="sm"
              mt="xs"
              aria-label="título"
              value={artigo?.titulo}
            />
          </Col>
        </Grid>
      </Box>
      {artigo?.descricao && (
        <Alert
          color="indigo"
          title="Descrição"
          mt="sm"
          icon={<IconFileDescription />}
        >
          {artigo?.descricao}
        </Alert>
      )}
      <SimpleGrid
        mt="md"
        cols={2}
        breakpoints={[
          { maxWidth: 'md', cols: 1, spacing: 'lg' },
          { maxWidth: 'sm', cols: 1, spacing: 'sm' },
        ]}
        mb="md"
      >
        <Stack>
          <Paper shadow="sm" py="sm">
            <Container size={'lg'}>{subfamiliaForm}</Container>
          </Paper>
        </Stack>
        <SimpleGrid>
          <Paper shadow="sm" py="sm">
            <Container size={'lg'}>{caracteristicasForm}</Container>
          </Paper>
          <Paper shadow="sm" py="sm">
            <Container size={'lg'}>{stockForm}</Container>
          </Paper>
        </SimpleGrid>
      </SimpleGrid>
      <Paper shadow="sm">
        <Container my="xl" py={'md'} size={'lg'}>
          <Group position="right">
            <Link to={`/artigos/actualizar/${id}`}>
              <Button loaderPosition="right" type="submit">
                Alterar Dados
              </Button>
            </Link>
          </Group>
        </Container>
      </Paper>
    </>
  );
};

export default ArtigoInfo;
