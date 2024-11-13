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
} from "@mantine/core";
import { TitleBar } from "../../Components/TitleBar";
import * as Yup from "yup";
import { useForm, yupResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconExclamationCircle, IconTrash } from "@tabler/icons";
import { useNavigate, useParams } from "react-router-dom";
import { openConfirmModal } from "@mantine/modals";
import { useEffect } from "react";
import { useUpdateFamiliaData } from "../../hooks/HandleFamilia/useUpdateFamilia";
import { usefetchFamiliaByID } from "../../hooks/HandleFamilia/useGetFamiliaByID";

const schema = Yup.object().shape({
  id: Yup.string(),
  titulo: Yup.string()
    .required("Insira o título")
    .min(2, "O título deve ter pelo menos 2 caracteres"),
  codigo: Yup.string()
    .required("Insira o código")
    .min(2, "O título deve ter pelo menos 2 caracteres"),
  descricao: Yup.string(),
});

const onDeleteClick = () => {
  openConfirmModal({
    title: "Confirme a exclusão",
    color: "red",
    children: (
      <>
        <Text fw="bold" size="sm">
          Apagar a família?
        </Text>
        <Text>Todos os dados serão perdidos. Deseja continuar?</Text>
      </>
    ),
    labels: { confirm: "Apagar", cancel: "Cancelar" },
    confirmProps: { color: "red" },
    onCancel: () => console.log("Cancel"),
    onConfirm: () => console.log("Confirmed"),
  });
};

const FamiliaUpdateForm = () => {
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
      title: <Text fw="bold">Falha na busca da família seleccionada</Text>,
      message: <Text color="dimmed">{error.message}</Text>,
      color: "red",
      autoClose: false,
      icon: <IconExclamationCircle />,
    });
  };

  const onUpdateSuccess = () => {
    showNotification({
      title: <Text fw="bold">Sucesso</Text>,
      message: <Text color="dimmed">Família Actualizada</Text>,
      icon: <IconCheck />,
    });
  };

  const onUpdateError = (error: any) => {
    showNotification({
      title: <Text fw="bold">Falha na actualização da família</Text>,
      message: <Text color="dimmed">{error.message}</Text>,
      color: "red",
      autoClose: false,
      icon: <IconExclamationCircle />,
    });
  };

  const form = useForm({
    validate: yupResolver(schema),
    initialValues: {
      id: "",
      codigo: "",
      titulo: "",
      descricao: "",
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

  const { mutate: updateFamilia, isLoading } = useUpdateFamiliaData();

  const { data: familia, isLoading: isFetching } = usefetchFamiliaByID(
    id,
    onErrorFetching
  );

  const onSubmit = (familia: any) => {
    updateFamilia(familia, {
      onError: onUpdateError,
      onSuccess: onUpdateSuccess,
    });
  };

  useEffect(() => {
    form.setValues({
      id: familia?.data.id,
      codigo: familia?.data.codigo,
      titulo: familia?.data.titulo,
      descricao: familia?.data.descricao,
    });
  }, [familia]);

  return (
    <>
      <TitleBar title={"Actualizar Família"} rightSection={rightSection} />
      <Paper shadow="sm">
        <Container my="xl" py={"md"} size={"lg"}>
          <Box sx={{ maxWidth: 500, position: "relative" }} mx="auto">
            <LoadingOverlay visible={isFetching} zIndex={200} />
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
                placeholder="Descrição da familia..."
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

export default FamiliaUpdateForm;
