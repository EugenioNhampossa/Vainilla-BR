import {
  Box,
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Select,
  NumberInput,
  Loader,
} from '@mantine/core';
import { TitleBar } from '../../Components/TitleBar';
import * as Yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useSelectProdutos } from '../../hooks/HandleProduto/useProdutosData';
import { useSelectArtigos } from '../../hooks/HandleArtigo/useArtigosData';
import { useAddSaidaStock } from '../../hooks/HandleSaidaStock/useAddSaida';

const schema = Yup.object({
  id_item: Yup.string().required('Seleccione o item'),
  tipo_item: Yup.mixed()
    .required('Seleccione o tipo de item')
    .oneOf(['Produto', 'Artigo']),
  quantidade: Yup.number()
    .min(1, 'A quantidade deve ser maior ou igual a 1')
    .required('Adicione a quantidade'),
  tipo_saida: Yup.mixed()
    .required('Seleccione a operação')
    .oneOf(['Oferta', 'Desperdicio']),
});

const SaidaCreateForm: React.FC = () => {
  const [tituloProd, setTituloProd] = useState<string | undefined>(undefined);
  const [tituloArt, setTituloArt] = useState<string | undefined>(undefined);

  const form = useForm({
    validate: yupResolver(schema),
    initialValues: {
      id_item: '',
      quantidade: 1,
      tipo_saida: '',
      tipo_item: 'Artigo',
    },
  });

  const { user } = useAuth0();
  const { data: produtos, isLoading: isLoadingProd } = useSelectProdutos({
    titulo: tituloProd,
  });

  const { data: artigos, isLoading: isLoadingArtigos } = useSelectArtigos({
    titulo: tituloArt,
  });

  const { mutate: addMovimento, isLoading: isPending } = useAddSaidaStock();

  const onSubmit = (movimento: any) => {
    addMovimento(
      { ...movimento, id_instalacao: user?.id_instalacao },
      {
        onSuccess: () => {
          form.reset();
        },
      },
    );
  };

  return (
    <>
      <TitleBar title={'Adicionar Entradas'} />
      <Paper shadow="sm">
        <Container my="xl" py={'md'} size={'lg'}>
          <Box sx={{ maxWidth: 500 }} mx="auto">
            <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
              <Stack>
                <Group>
                  <Select
                    label="Tipo de item"
                    withAsterisk
                    variant="filled"
                    data={['Artigo', 'Produto']}
                    {...form.getInputProps('tipo_item')}
                  />
                </Group>
                {form.values.tipo_item == 'Produto' && (
                  <Select
                    label="Produto"
                    withAsterisk
                    variant="filled"
                    placeholder="Seleccione um produto"
                    searchable
                    onSearchChange={setTituloProd}
                    nothingFound="Nenhum produto encontrado"
                    data={produtos || []}
                    maxDropdownHeight={150}
                    rightSection={isLoadingProd && <Loader size={18} />}
                    {...form.getInputProps('id_item')}
                  />
                )}
                {form.values.tipo_item == 'Artigo' && (
                  <Select
                    label="Artigo"
                    withAsterisk
                    variant="filled"
                    placeholder="Seleccione um artigo"
                    searchable
                    onSearchChange={setTituloArt}
                    nothingFound="Nenhum artigo encontrado"
                    data={artigos || []}
                    maxDropdownHeight={150}
                    rightSection={isLoadingArtigos && <Loader size={18} />}
                    {...form.getInputProps('id_item')}
                  />
                )}
                <Select
                  label="Operação"
                  withAsterisk
                  variant="filled"
                  placeholder="Seleccione a operação"
                  data={['Oferta', 'Desperdicio']}
                  maxDropdownHeight={150}
                  {...form.getInputProps('tipo_saida')}
                />
                <NumberInput
                  withAsterisk
                  label="Quantidade"
                  variant="filled"
                  placeholder="Adicione a quantidade"
                  min={0.01}
                  precision={2}
                  {...form.getInputProps('quantidade')}
                />
                <Group position="right">
                  <Button
                    type="button"
                    color="red"
                    variant="light"
                    onClick={() => form.reset()}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" loading={isPending}>
                    Registrar
                  </Button>
                </Group>
              </Stack>
            </form>
          </Box>
        </Container>
      </Paper>
    </>
  );
};

export default SaidaCreateForm;
