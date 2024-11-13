import {
  Button,
  Container,
  Group,
  Paper,
  TextInput,
  Text,
  SimpleGrid,
  Tooltip,
  MediaQuery,
  Accordion,
  Badge,
  Alert,
  Box,
  Loader,
} from "@mantine/core";
import {
  IconEdit,
  IconExclamationCircle,
  IconFileDescription,
  IconFilter,
  IconFilterOff,
  IconPlus,
} from "@tabler/icons";
import { TitleBar } from "../../Components/TitleBar";
import { Link, useParams } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import { Tabela } from "../../Components/Tabela/Tabela";
import { useEffect, useState } from "react";
import { useSubFamiliasData } from "../../hooks/HandleSubFamilia/useSubFamiliasData";
import { usefetchFamiliaByID } from "../../hooks/HandleFamilia/useGetFamiliaByID";

export const SubFamiliaList = () => {
  const { idfamilia }: any = useParams();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [titulo, setTitulo] = useState("");
  const [codigo, setCodigo] = useState("");

  const rightSection = (
    <div>
      <Link to={`/familias/${idfamilia}/subfamilias/cadastrar`}>
        <Button size="xs" leftIcon={<IconPlus size={16} />}>
          Adicionar
        </Button>
      </Link>
    </div>
  );

  const rowExpansion = {
    content: ({ record }: any) => (
      <Group p="xs" ml="md" spacing={6}>
        <Text fw="bold">Descricao:</Text>
        <Text>{record.descricao}</Text>
      </Group>
    ),
  };

  const columns = [
    { accessor: "codigo", title: "Código" },
    { accessor: "titulo", title: "Título" },
    {
      accessor: "dataCriacao",
      title: "Registrado em",
      hidden: true,
      render: ({ dataCriacao }: any) =>
        new Date(dataCriacao).toLocaleString("pt"),
    },
    {
      accessor: "dataActualizacao",
      title: "Ultima Actualizacao",
      hidden: true,
      render: ({ dataActualizacao }: any) =>
        new Date(dataActualizacao).toLocaleString("pt"),
    },
    {
      accessor: "actions",
      title: <Text mr="xs">Acções</Text>,
      render: (record: any) => (
        <Group spacing={4} noWrap>
          <Tooltip label={"Editar " + record.titulo} position="left">
            <Link
              to={`/familias/${idfamilia}/subfamilias/actualizar/${record.id}`}
            >
              <Button compact variant="light" color="blue">
                <IconEdit size={19} />
              </Button>
            </Link>
          </Tooltip>
        </Group>
      ),
    },
  ];

  const onError = (data: any) => {
    showNotification({
      title: <Text fw="bold">Falha na busca das sub-famílias</Text>,
      message: (
        <Text color="dimmed">
          {data.response.data.message || data.message}
        </Text>
      ),
      color: "red",
      autoClose: false,
      icon: <IconExclamationCircle />,
    });
  };

  const onFamiliaError = (data: any) => {
    showNotification({
      title: <Text fw="bold">Falha na busca da família seleccionada</Text>,
      message: (
        <Text color="dimmed">
          {data.response.data.message[0] || data.message}
        </Text>
      ),
      color: "red",
      autoClose: false,
      icon: <IconExclamationCircle />,
    });
  };

  const { data: subfamilias, isLoading: isSubFamiliaLoading } =
    useSubFamiliasData({
      onError,
      filter: { codigo, titulo },
      idFilter: idfamilia,
      page,
      perPage,
    });

  const { data: familia, isLoading: isFamiliaLoading } = usefetchFamiliaByID(
    idfamilia,
    onFamiliaError
  );

  const onFilterSubmit = (e: any) => {
    e.preventDefault();
    setTitulo(e.target.titulo.value.trim());
    setCodigo(e.target.codigo.value.trim());
    setPage(1);
  };

  const reset = () => {
    const form: any = document.getElementById("filterSubFam");
    form.reset();
    setTitulo("");
    setCodigo("");
  };

  const filterForm = (
    <form id="filterSubFam" onSubmit={(e) => onFilterSubmit(e)}>
      <SimpleGrid
        cols={3}
        breakpoints={[
          { maxWidth: "md", cols: 3, spacing: "md" },
          { maxWidth: "sm", cols: 2, spacing: "sm" },
          { maxWidth: "xs", cols: 1, spacing: "sm" },
        ]}
        mb="md"
      >
        <TextInput
          label="Código"
          variant="filled"
          name="codigo"
          placeholder="Insira o codigo"
        />
        <TextInput
          label="Título"
          variant="filled"
          name="titulo"
          placeholder="Insira o titulo"
        />
      </SimpleGrid>
      <Group position="right">
        <Button
          variant="outline"
          onClick={() => reset()}
          compact
          leftIcon={<IconFilterOff />}
        >
          Limpar
        </Button>
        <Button type="submit" compact leftIcon={<IconFilter />}>
          Filtrar
        </Button>
      </Group>
    </form>
  );
  return (
    <>
      <TitleBar title={"Sub-famílias"} rightSection={rightSection} />
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
          {isFamiliaLoading ? (
            <Loader size="sm" variant="dots" color="#fff" />
          ) : (
            familia?.data?.titulo
          )}
        </Badge>
        <Badge mt="xs" color="teal" size="lg" radius="xs" variant="filled">
          Código:{" "}
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
        <Container my="xl" py={"md"} size={"lg"}>
          <MediaQuery smallerThan={"xs"} styles={{ display: "none" }}>
            {filterForm}
          </MediaQuery>
          <MediaQuery largerThan={"xs"} styles={{ display: "none" }}>
            <Accordion variant="separated">
              <Accordion.Item value="filtros">
                <Accordion.Control icon={<IconFilter size={20} color="blue" />}>
                  <Text fw={"bold"}>Filtros</Text>
                </Accordion.Control>
                <Accordion.Panel>{filterForm}</Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </MediaQuery>
        </Container>
      </Paper>
      <Paper shadow="sm">
        <Container my="xl" py={"md"} size={"lg"}>
          <Tabela
            rowExpansion={rowExpansion}
            columns={columns}
            data={subfamilias?.data}
            isLoading={isSubFamiliaLoading}
            page={page}
            setPage={setPage}
            perPage={perPage}
            setPerPage={setPerPage}
          />
        </Container>
      </Paper>
    </>
  );
};

export default SubFamiliaList;
