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
  LoadingOverlay,
} from "@mantine/core";
import { TitleBar } from "../../Components/TitleBar";
import * as Yup from "yup";
import { useForm, yupResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import {
  IconCheck,
  IconExclamationCircle,
  IconFileDescription,
  IconTrash,
} from "@tabler/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { usefetchSubFamiliaByID } from "../../hooks/HandleSubFamilia/useGetSubFamiliaByID";
import { useUpdateSubFamiliaData } from "../../hooks/HandleSubFamilia/useUpdateSubFamilia";
import { openConfirmModal } from "@mantine/modals";

const schema = Yup.object().shape({
  id_familia: Yup.string(),
  titulo: Yup.string()
    .required("Insira o título")
    .min(2, "O título deve ter pelo menos 2 caracteres"),
  codigo: Yup.string()
    .required("Insira o código")
    .min(2, "O código deve ter pelo menos 2 caracteres"),
  descricao: Yup.string(),
});

const SubFamiliaUpdateForm = () => {
  const navigate = useNavigate();
  const { idSubfamilia }: any = useParams();
  const { idfamilia }: any = useParams();
  const [familia, setFamilia]: any = useState({});

  const onDeleteClick = () => {
    openConfirmModal({
      title: "Confirme a exclusão",
      color: "red",
      children: (
        <>
          <Text fw="bold" size="sm">
            Apagar a sub-família?
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

  const form = useForm({
    validate: yupResolver(schema),
    initialValues: {
      id: "",
      id_familia: "",
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

  const onError = (data: any) => {
    showNotification({
      title: <Text fw="bold">Falha na actualização da sub-família</Text>,
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
      message: <Text color="dimmed">Sub-Família Actualizada</Text>,
      icon: <IconCheck />,
    });
  };

  const onSubFamiliaError = (error: Error) => {
    showNotification({
      title: <Text fw="bold">Falha na busca da sub-família seleccionada</Text>,
      message: <Text color="dimmed">{error.message}</Text>,
      color: "red",
      autoClose: false,
      icon: <IconExclamationCircle />,
    });
  };

  const { data: subfamiliaData, isLoading: isSubFamiliaLoading } =
    usefetchSubFamiliaByID(idSubfamilia, onSubFamiliaError);

  const { mutate: updateSubFamilia, isLoading } =
    useUpdateSubFamiliaData(idfamilia);

  useEffect(() => {
    setFamilia(subfamiliaData?.data.Familia);

    const codSub = subfamiliaData?.data.codigo;
    const cod = codSub?.substring(
      codSub?.length -
        (codSub?.length - subfamiliaData?.data.Familia?.codigo.length)
    );
    console.log(cod);

    form.setValues({
      id: idSubfamilia,
      id_familia: idfamilia,
      titulo: subfamiliaData?.data.titulo,
      codigo: cod,
      descricao: subfamiliaData?.data.descricao,
    });
  }, [subfamiliaData]);

  const onSubmit = (subfamilia: any) => {
    updateSubFamilia(
      { ...subfamilia, codigo: familia?.codigo + subfamilia.codigo },
      {
        onError,
        onSuccess,
      }
    );
  };

  return (
    <>
      <TitleBar title={"Actualizar Sub-Família"} rightSection={rightSection} />
      <Box m="md">
        <Badge
          mt="xs"
          mr="xs"
          color="teal"
          size="lg"
          radius="xs"
          variant="filled"
        >
          Família:{" "}
          {isSubFamiliaLoading ? (
            <Loader size="sm" variant="dots" color="#fff" />
          ) : (
            familia?.titulo
          )}
        </Badge>
        <Badge mt="xs" color="teal" size="lg" radius="xs" variant="filled">
          Código:{" "}
          {isSubFamiliaLoading ? (
            <Loader color="#fff" size="sm" variant="dots" />
          ) : (
            familia?.codigo
          )}
        </Badge>
      </Box>
      {familia?.descricao && (
        <Alert
          color="indigo"
          title="Descrição"
          mt="sm"
          icon={<IconFileDescription />}
        >
          <Text align="justify">{familia?.descricao}</Text>
        </Alert>
      )}
      <Paper shadow="sm">
        <Container my="xl" py={"md"} size={"lg"}>
          <Box sx={{ maxWidth: 500, position: "relative" }} mx="auto">
            <LoadingOverlay visible={isSubFamiliaLoading} zIndex={200} />
            <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
              <TextInput
                description="O código gerado pertencerá a sub-familia"
                readOnly
                variant="unstyled"
                label="Código Gerado"
                type="text"
                mt="sm"
                value={familia?.codigo + form.values.codigo}
              />
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
                placeholder="Descrição da sub-família..."
                {...form.getInputProps("descricao")}
              />
              <Group position="right" mt="xl">
                <Button
                  onClick={() => {
                    form.reset;
                    navigate(`/familias/${idfamilia}/subfamilias`);
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

export default SubFamiliaUpdateForm;
