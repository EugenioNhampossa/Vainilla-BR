import { useAuth0 } from "@auth0/auth0-react";
import {
  createStyles,
  Badge,
  Group,
  Title,
  Text,
  Card,
  SimpleGrid,
  Button,
} from "@mantine/core";
import { IconGauge, IconUser, IconCookie } from "@tabler/icons";

const mockdata = [
  {
    title: "Performance",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ut cupiditate eaque quod repudiandae! Sint magnam accusantium eum.",
    icon: IconGauge,
  },
  {
    title: "Focado em Privacidade",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse officiis odit qui quidem provident perspiciatis dolorem perferendis ex consequatur.",
    icon: IconUser,
  },
  {
    title: "Sem terceiros",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Incidunt, nesciunt numquam quo modi magnam unde.",
    icon: IconCookie,
  },
];

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: 34,
    fontWeight: 900,
    [theme.fn.smallerThan("sm")]: {
      fontSize: 24,
    },
  },

  description: {
    maxWidth: 600,
    margin: "auto",

    "&::after": {
      content: '""',
      display: "block",
      backgroundColor: theme.fn.primaryColor(),
      width: 45,
      height: 2,
      marginTop: theme.spacing.sm,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },

  card: {
    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },

  cardTitle: {
    "&::after": {
      content: '""',
      display: "block",
      backgroundColor: theme.fn.primaryColor(),
      width: 45,
      height: 2,
      marginTop: theme.spacing.sm,
    },
  },
}));

export function Home() {
  const { classes, theme } = useStyles();

  const features = mockdata.map((feature) => (
    <Card
      key={feature.title}
      shadow="md"
      radius="md"
      className={classes.card}
      p="xl"
    >
      <feature.icon size={50} stroke={2} color={theme.fn.primaryColor()} />
      <Text size="lg" weight={500} className={classes.cardTitle} mt="md">
        {feature.title}
      </Text>
      <Text size="sm" color="dimmed" mt="sm">
        {feature.description}
      </Text>
    </Card>
  ));

  return (
    <>
      <Group position="center">
        <Badge variant="filled" size="xl">
          Melhor Sistema
        </Badge>
      </Group>

      <Title order={2} className={classes.title} align="center" mt="sm">
        Integre-se sem esforço com qualquer tecnologia
      </Title>

      <Text
        color="dimmed"
        className={classes.description}
        align="center"
        mt="md"
      >
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum nostrum
        at voluptas voluptate ullam consequuntur animi eius aliquam.
      </Text>

      <SimpleGrid
        cols={3}
        spacing="xl"
        mt={50}
        breakpoints={[{ maxWidth: "md", cols: 1 }]}
      >
        {features}
      </SimpleGrid>
    </>
  );
}
