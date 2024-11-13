import {
  AppShell,
  Navbar,
  Header,
  MediaQuery,
  Burger,
  Box,
  createStyles,
  Group,
} from '@mantine/core';
import './layout.css';
import { useSelector, useDispatch } from 'react-redux';
import { layoutAction } from '../Store/layout/layout-slice';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AvatarMenu } from '../Components/AvatarMenu';
import { DoubleNavbar } from './DoubleNavbar';
import React, { useEffect } from 'react';
import { PageLoader } from '../Components/PageLoader';
import { ColorScheneToggle } from '../Components/ColorScheneToggle';
import { ROUTES } from './Routes';
import { useAppSelector } from '../hooks/appStates';
import { useAuth0 } from '@auth0/auth0-react';
import { userSlice } from '../Store/user/user-slice';
import jwtDecode from 'jwt-decode';
import { AUDIENCE } from '../auth/provider';
import { showNotification } from '@mantine/notifications';

const useStyles = createStyles((theme) => ({
  main: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
  },
}));

export function AdminLayout() {
  const opened = useSelector((state: any) => state.layout.navbar.opened);
  const role = useAppSelector((state) => state.user.role);
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const location = useLocation();

  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const showNavigtion = () => {
    return (
      location.pathname.includes('/pedidos/cadastrar') ||
      location.pathname.includes('/producao') ||
      location.pathname.includes('callback')
    );
  };

  useEffect(() => {
    getAccessTokenSilently()
      .then((claims) => {
        const data: any = jwtDecode(claims);
        const userRole = data[`${AUDIENCE}/roles`][0];
        dispatch(userSlice.actions.setRole(userRole));
      })
      .catch((err) => {
        if (isAuthenticated) {
          showNotification({
            message: err.message,
          });
        }
      });
  }, []);

  return (
    <AppShell
      className={classes.main}
      padding="xs"
      layout="alt"
      navbar={
        showNavigtion() ? (
          <></>
        ) : (
          <Navbar
            sx={{ zIndex: 201 }}
            withBorder={false}
            hiddenBreakpoint="sm"
            hidden={!opened}
            width={{ sm: 250 }}
          >
            <DoubleNavbar />
          </Navbar>
        )
      }
      header={
        showNavigtion() ? (
          <></>
        ) : (
          <Header height={{ base: 45, md: 50 }} p="md" withBorder>
            <div className="header">
              <Box sx={{ display: 'flex' }}>
                <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                  <Burger
                    opened={opened}
                    onClick={() => dispatch(layoutAction.toggleNavBar())}
                    size="sm"
                    mr="xl"
                  />
                </MediaQuery>
              </Box>
              <Box
                sx={(theme) => ({
                  fontSize: theme.fontSizes.md,
                  '@media (max-width: 610px)': {
                    display: 'none',
                  },
                })}
              ></Box>
              <Group position="right">
                <ColorScheneToggle />
                <AvatarMenu />
              </Group>
            </div>
          </Header>
        )
      }
    >
      <>
        <React.Suspense fallback={<PageLoader />}>
          <Routes>
            {ROUTES.map(({ path, element, roles }) => {
              if (roles?.includes(role) || path == '/callback') {
                return <Route key={path} path={path} element={element} />;
              }
            })}
          </Routes>
        </React.Suspense>
      </>
    </AppShell>
  );
}
