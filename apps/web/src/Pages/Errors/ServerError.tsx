import {
  createStyles,
  Title,
  Text,
  Button,
  Container,
  Group,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: 80,
    paddingBottom: 120,
    backgroundColor: theme.fn.variant({
      variant: 'filled',
      color: theme.primaryColor,
    }).background,
  },

  label: {
    textAlign: 'center',
    fontWeight: 900,
    fontSize: 220,
    lineHeight: 1,
    marginBottom: theme.spacing.xl * 1.5,
    color: theme.colors[theme.primaryColor][3],

    [theme.fn.smallerThan('sm')]: {
      fontSize: 120,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    textAlign: 'center',
    fontWeight: 900,
    fontSize: 38,
    color: theme.white,

    [theme.fn.smallerThan('sm')]: {
      fontSize: 32,
    },
  },

  description: {
    maxWidth: 540,
    margin: 'auto',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl * 1.5,
    color: theme.colors[theme.primaryColor][1],
  },
}));

function ServerError() {
  const { classes } = useStyles();
  const navigate = useNavigate();

  return (
    <div className={classes.root}>
      <Container>
        <div className={classes.label}>500</div>
        <Title className={classes.title}>Algo mau acabou de acontecer...</Title>
        <Text size="lg" align="center" className={classes.description}>
          Nossos servidores não puderam lidar com sua solicitação. Não se
          preocupe, nossa equipe de desenvolvimento foi já notificada. Tente
          atualizar a página.
        </Text>
        <Group position="center">
          <Button
            variant="white"
            size="md"
            onClick={() => {
              navigate(-1);
              window.location.reload();
            }}
          >
            Actualizar a página
          </Button>
        </Group>
      </Container>
    </div>
  );
}

export default ServerError;
