import {
  Button,
  Container,
  Group,
  Paper,
  TextInput,
  Text,
  SimpleGrid,
  ActionIcon,
  Tooltip,
  MediaQuery,
  Accordion,
} from "@mantine/core";
import {
  IconEdit,
  IconExclamationCircle,
  IconFilter,
  IconFilterOff,
  IconPlus,
} from "@tabler/icons";
import { TitleBar } from "../../Components/TitleBar";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useClientesData } from "../../hooks/HandleCliente/useClientesData";
import { showNotification } from "@mantine/notifications";
import { Tabela } from "../../Components/Tabela/Tabela";
import { useState } from "react";

const rightSection = (
  <div>
    <Link to={"/clientes/cadastrar"}>
      <Button size="xs" leftIcon={<IconPlus size={16} />}>
        Adicionar
      </Button>
    </Link>
  </div>
);

const columns = [
  { accessor: "nuit", title: "Nuit" },
  { accessor: "nome", title: "Nome" },
  { accessor: "email", title: "Email" },
  { accessor: "cell1", title: "Celular" },
  { accessor: "cell2", title: "Celular Alt." },
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
    textAlignment: "right",
    render: (cliente: any) => (
      <Group spacing={4} position="center" noWrap>
        <Tooltip label={"Editar " + cliente.nome} position="left">
          <Link to={`/clientes/actualizar/${cliente.id}`}>
            <ActionIcon color="blue">
              <IconEdit size={19} />
            </ActionIcon>
          </Link>
        </Tooltip>
      </Group>
    ),
  },
];

export const ClienteLista = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(30);
  const [nome, setNome] = useState("");
  const [nuit, setNuit] = useState("");
  const [email, setEmail] = useState("");

  const onError = (data: any) => {
    showNotification({
      title: <Text fw="bold">Falha na busca dos clientes</Text>,
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

  const {
    data: clientes,
    isLoading,
    isError,
  } = useClientesData({
    onError,
    filter: { nome, nuit, email },
    page,
    perPage,
  });

  const onFilterSubmit = (e: any) => {
    e.preventDefault();
    setNome(e.target.nome.value.trim());
    setEmail(e.target.email.value.trim());
    setNuit(e.target.nuit.value.trim());
    setPage(1);
  };

  const reset = () => {
    const form: any = document.getElementById("filterClientes");
    form.reset();
    setEmail("");
    setNome("");
    setNuit("");
  };

  const filterForm = (
    <form id="filterClientes" onSubmit={(e) => onFilterSubmit(e)}>
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
          label="Nuit"
          variant="filled"
          name="nuit"
          placeholder="Insira o nuit"
        />
        <TextInput
          label="Nome"
          variant="filled"
          name="nome"
          placeholder="Insira o nome"
        />
        <TextInput
          label="Email"
          variant="filled"
          name="email"
          placeholder="Insira o email"
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
      <TitleBar title={"Clientes"} rightSection={rightSection} />
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
            columns={columns}
            data={clientes?.data}
            isLoading={isLoading}
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

export default ClienteLista;
