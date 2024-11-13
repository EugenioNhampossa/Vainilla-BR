import {
  Box,
  Button,
  Container,
  Group,
  Paper,
  TextInput,
  Text,
  Textarea,
} from "@mantine/core";
import { TitleBar } from "../../Components/TitleBar";
import * as Yup from "yup";
import { useForm, yupResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconExclamationCircle } from "@tabler/icons";
import { useNavigate } from "react-router-dom";
import { useAddFamiliaData } from "../../hooks/HandleFamilia/useAddFamilia";

const schema = Yup.object().shape({
  titulo: Yup.string()
    .required("Insira o título")
    .min(2, "O título deve ter pelo menos 2 caracteres"),
  codigo: Yup.string()
    .required("Insira o código")
    .min(2, "O título deve ter pelo menos 2 caracteres"),
  descricao: Yup.string(),
});

const FamiliaCreateForm = () => {
  const navigate = useNavigate();

  const form = useForm({
    validate: yupResolver(schema),
    initialValues: {
      codigo: "",
      titulo: "",
      descricao: "",
    },
    transformValues: (values) => {
      return {
        codigo: values.codigo.trim(),
        titulo: values.titulo.trim(),
        descricao: values.descricao.trim(),
      };
    },
  });

  const onError = (data: any) => {
    showNotification({
      title: <Text fw="bold">Falha no registro da família</Text>,
      message: (
        <Text color="dimmed">{data.response.data.message || data.message}</Text>
      ),
      color: "red",
      autoClose: false,
      icon: <IconExclamationCircle />,
    });
  };

  const onSuccess = () => {
    showNotification({
      title: <Text fw="bold">Sucesso</Text>,
      message: <Text color="dimmed">Família Registrada</Text>,
      color: "green",
      icon: <IconCheck />,
    });
    form.reset();
  };

  const { mutate: addFamilia, isLoading } = useAddFamiliaData();

  const onSubmit = (familia: any) => {
    addFamilia(familia, {
      onError,
      onSuccess,
    });
  };

  return (
    <>
      <TitleBar title={"Adicionar Famílias"} />
      <Paper shadow="sm">
        <Container my="xl" py={"md"} size={"lg"}>
          <Box sx={{ maxWidth: 500 }} mx="auto">
            <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
              <TextInput
                withAsterisk
                variant="filled"
                label="Código"
                placeholder="Insira o código"
                type="text"
                mt="sm"
                {...form.getInputProps("codigo")}
              />
              <TextInput
                withAsterisk
                label="Título"
                variant="filled"
                type="text"
                placeholder="Insira o título"
                mt="sm"
                {...form.getInputProps("titulo")}
              />
              <Textarea
                label="Descrição"
                variant="filled"
                mt="sm"
                placeholder="Descrição da família..."
                {...form.getInputProps("descricao")}
              />
              <Group position="right" mt="xl">
                <Button
                  onClick={() => {
                    form.reset;
                    navigate("/familias");
                  }}
                  variant="outline"
                  color={"red"}
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

export default FamiliaCreateForm;
