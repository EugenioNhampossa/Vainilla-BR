import {
  Button,
  Container,
  createStyles,
  Group,
  Text,
  Title,
} from "@mantine/core";
import { IconMoodConfuzed } from "@tabler/icons";

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: 10,
    paddingBottom: 10,
  },

  label: {
    textAlign: "center",
    fontWeight: 900,
    fontSize: 160,
    lineHeight: 1,
    marginBottom: theme.spacing.xl * 1.5,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.colors.gray[2],

    [theme.fn.smallerThan("sm")]: {
      fontSize: 90,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    textAlign: "center",
    fontWeight: 900,
    fontSize: 38,

    [theme.fn.smallerThan("sm")]: {
      fontSize: 32,
    },
  },

  description: {
    maxWidth: 500,
    margin: "auto",
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl * 1.5,
  },
}));

export default function ErrorFallback({ error }: any) {
  const { classes } = useStyles();
  return (
    <Container className={classes.root}>
      <div className={classes.label}>OOPS!</div>
      <Title className={classes.title}>Alguma Coisa Correu Mal.</Title>
      <Text
        color="dimmed"
        size="lg"
        align="center"
        className={classes.description}
      >
        Lamentamos, mas ocorreu um erro. Tente Novamente.
      </Text>
      <Text color={"red"}>
        <pre>{error.message}</pre>
      </Text>
      <Group position="center">
        <Button
          variant="subtle"
          size="md"
          onClick={() => window.location.reload()}
        >
          Recaregar a Página
        </Button>
      </Group>
    </Container>
  );
}
