import {
  IconExclamationCircle,
  IconLogout,
  IconMessageCircle,
  IconSearch,
  IconSettings,
  IconUserCircle,
  IconX,
} from '@tabler/icons';
import {
  Group,
  Avatar,
  Text,
  UnstyledButton,
  MediaQuery,
  Box,
  Divider,
  NavLink,
  createStyles,
  Loader,
  Stack,
  Button,
  ActionIcon,
} from '@mantine/core';
import { useDispatch } from 'react-redux';
import { AsideDrawer } from './AsideDrawer';
import { layoutAction } from '../Store/layout/layout-slice';
import { openConfirmModal, useModals } from '@mantine/modals';
import { useAuth0 } from '@auth0/auth0-react';
import { usefetchInstalacaoByID } from '../hooks/HandleInstalacao/useGetInstalacaoByID';

const useStyles = createStyles((theme) => ({
  linkButton: {
    borderRadius: theme.radius.sm,
    margin: `${theme.spacing.xs}px 0`,
  },
}));

export function AvatarMenu() {
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const modals = useModals();

  const { isLoading, logout, user } = useAuth0();

  const handleLogoutClick = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  const { data: instalacao, isLoading: isLoadingInst } = usefetchInstalacaoByID(
    user?.id_instalacao,
  );

  const Drawer = (
    <AsideDrawer>
      <Group position="apart" w="100%">
        <Group>
          <Avatar size={40} color="red" src={user?.picture} />
          {isLoading ? (
            <Loader size="sm" variant="dots" />
          ) : (
            <div>
              <Text size="md"> {user?.name}</Text>
              <Text size="sm" color="dimmed">
                {user?.email}
              </Text>
            </div>
          )}
        </Group>
        <ActionIcon onClick={() => dispatch(layoutAction.toggleDrawer())}>
          <IconX />
        </ActionIcon>
      </Group>
      <Divider my="md" />
      <Box mt="lg">
        <Stack>
          <Box>
            <div className="text-xs text-gray-400">Instalação</div>
            <div className="text-sm">
              {isLoadingInst ? <Loader size="sm" /> : instalacao?.data.titulo}
            </div>
          </Box>
        </Stack>
      </Box>
      <Box mt="lg">
        <NavLink
          className={classes.linkButton}
          active
          icon={<IconUserCircle size={18} />}
          label="Meus Dados"
        />
        <Divider my="md" />
        <NavLink
          className={classes.linkButton}
          active
          icon={<IconSearch size={18} />}
          label="Pesquisa"
        />
        <Divider my="md" />
        <NavLink
          className={classes.linkButton}
          color="red"
          active
          onClick={() =>
            openConfirmModal({
              title: 'Confirme o logout',
              color: 'red',
              children: (
                <>
                  <Stack>
                    <Text fw="bold" size="sm">
                      Deseja realmente saír?
                    </Text>
                  </Stack>
                </>
              ),
              labels: {
                confirm: (
                  <Button loading={isLoading} color="red">
                    Saír
                  </Button>
                ),
                cancel: 'Cancelar',
              },
              confirmProps: { color: 'red' },
              onCancel: () => modals.closeAll(),
              onConfirm: () => handleLogoutClick(),
            })
          }
          icon={<IconLogout size={18} />}
          label="Saír"
        />
      </Box>
    </AsideDrawer>
  );

  return (
    <>
      <UnstyledButton onClick={() => dispatch(layoutAction.toggleDrawer())}>
        <Group>
          <Avatar size={35} color="red" src={user?.picture} />
          <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
            {isLoading ? (
              <Loader size="sm" variant="dots" />
            ) : (
              <div>
                <Text size="sm"> {user?.nickname}</Text>
                <Text size="xs" color="dimmed">
                  {user?.email}
                </Text>
              </div>
            )}
          </MediaQuery>
        </Group>
      </UnstyledButton>
      {Drawer}
    </>
  );
}
