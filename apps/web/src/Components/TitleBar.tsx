import {
  Paper,
  Title,
  createStyles,
  Box,
  Text,
  Stack,
  Divider,
  Tooltip,
  Grid,
  Col,
  Group,
  MediaQuery,
  Affix,
} from '@mantine/core';
import { IconArrowBack, IconArrowForward } from '@tabler/icons';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface titleBarProps {
  title: string;
  rightSection?: ReactNode;
}

const style = createStyles((theme) => ({
  titleBar: {
    marginBottom: theme.spacing.xs,
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    alignItems: 'center',
    minHeight: '60px',
    justifyContent: 'space-between',
  },

  backLabel: {
    cursor: 'pointer',
    fontSize: theme.spacing.md,
    '&:hover': {
      color: theme.colors.blue[9],
      transform: 'translateX(4px)',
      marginRight: '20px',
      transition: '300ms',
    },
  },
}));

export const TitleBar = ({ title, rightSection }: titleBarProps) => {
  const { classes } = style();
  const navigate = useNavigate();

  return (
    <Paper py="xs" className={classes.titleBar} shadow="sm">
      <Group position="apart" w="100%" spacing={0}>
        <Stack spacing={0}>
          <Title px="md" order={3}>
            {title}
          </Title>
          <Divider
            color="blue"
            mb="xs"
            px="md"
            label={
              <Tooltip
                openDelay={500}
                closeDelay={100}
                withArrow
                label={'Voltar à página anterior'}
                position="bottom"
              >
                <Text
                  onClick={() => navigate(-1)}
                  className={classes.backLabel}
                >
                  <Group spacing={5}>
                    <IconArrowBack size={20} />
                    Voltar
                  </Group>
                </Text>
              </Tooltip>
            }
          />
        </Stack>
        <Box sx={{ textAlign: 'right' }} py={5} px="md">
          {rightSection}
        </Box>
      </Group>
    </Paper>
  );
};
