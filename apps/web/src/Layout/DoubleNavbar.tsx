import {
  createStyles,
  Navbar,
  UnstyledButton,
  Tooltip,
  Title,
  NavLink,
  Box,
  MediaQuery,
  Burger,
  Group,
  ThemeIcon,
  ScrollArea,
} from '@mantine/core';
import {
  IconDeviceDesktopAnalytics,
  IconShoppingBag,
  IconSettings,
  IconCategory,
  IconReportAnalytics,
  IconChefHat,
} from '@tabler/icons';
import { useDispatch, useSelector } from 'react-redux';
import { layoutAction } from '../Store/layout/layout-slice';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { linksDefinicoes, linksGestao, linksRelatorio } from './Links';

const useStyles = createStyles((theme) => ({
  wrapper: {
    display: 'flex',
  },

  aside: {
    flex: '0 0 60px',
    backgroundColor: theme.colors.blue[9],
    color: theme.white,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRight: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
  },

  main: {
    flex: 1,
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
  },

  mainLink: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.sm,
    display: 'flex',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.white,

    '&:hover': {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: 'filled', color: theme.primaryColor })
          .background!,
        0.1,
      ),
    },
  },

  mainLinkActive: {
    opacity: 1,
    '&, &:hover': {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: 'filled', color: theme.primaryColor })
          .background!,
        0.15,
      ),
    },
  },

  title: {
    boxSizing: 'border-box',
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.xs,
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]
    }`,
    marginBottom: theme.spacing.xs,
  },

  logo: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: theme.spacing.xs,
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[3]
    }`,
    marginBottom: 44 + theme.spacing.xs,
  },

  link: {
    boxSizing: 'border-box',
    display: 'flex',
    textDecoration: 'none',
    borderTopRightRadius: theme.radius.sm,
    borderBottomRightRadius: theme.radius.sm,
    padding: `0 ${theme.spacing.md}px`,
    fontSize: theme.fontSizes.sm,
    marginRight: theme.spacing.md,
    marginBottom: 5,
    fontWeight: 500,
    height: 44,
    lineHeight: '44px',

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[5]
          : theme.colors.gray[1],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  childrenLink: {
    height: '35px',
  },

  linkActive: {
    '&, &:hover': {
      borderLeftColor: theme.fn.variant({
        variant: 'filled',
        color: theme.primaryColor,
      }).background,
      backgroundColor: theme.fn.variant({
        variant: 'filled',
        color: theme.primaryColor,
      }).background,
      color: theme.white,
    },
  },
}));

const mainLinksMockdata = [
  {
    icon: IconCategory,
    label: 'Gestão',
  },
  {
    icon: IconDeviceDesktopAnalytics,
    label: 'Caixa',
  },
  {
    icon: IconChefHat,
    label: 'Produção',
  },
  {
    icon: IconReportAnalytics,
    label: 'Relatórios',
  },
  {
    icon: IconSettings,
    label: 'Definições',
  },
];

export function DoubleNavbar() {
  const { classes, cx } = useStyles();
  const opened = useSelector((state: any) => state.layout.navbar.opened);
  const activeLink = useSelector((state: any) => state.layout.navbar.activeTab);
  const activeLinks = useSelector(
    (state: any) => state.layout.navbar.activeLinks,
  );
  const [links, setLinks] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [clicked, setClicked] = useState(false);

  function handleLinkClick(path: string | undefined) {
    if (path) {
      navigate(path);
      dispatch(layoutAction.toggleNavBar());
      setClicked(!clicked);
    }
  }

  useEffect(() => {
    const active = localStorage.getItem('activeLinks');
    switch (active) {
      case 'gestao':
        dispatch(layoutAction.setActiveTab('Gestão'));
        dispatch(layoutAction.setActiveLinks(linksGestao));
        break;
      case 'definicoes':
        dispatch(layoutAction.setActiveLinks(linksDefinicoes));
        dispatch(layoutAction.setActiveTab('Definições'));
        break;
      case 'relatorios':
        dispatch(layoutAction.setActiveLinks(linksRelatorio));
        dispatch(layoutAction.setActiveTab('Relatórios'));
        break;
      default:
        dispatch(layoutAction.setActiveTab('Gestão'));
        break;
    }
  }, [activeLinks]);

  function handleMainLinkClick(label: string) {
    switch (label) {
      case 'Gestão':
        dispatch(layoutAction.setActiveLinks(linksGestao));
        localStorage.setItem('activeLinks', 'gestao');
        break;
      case 'Definições':
        dispatch(layoutAction.setActiveLinks(linksDefinicoes));
        localStorage.setItem('activeLinks', 'definicoes');
        break;
      case 'Relatórios':
        dispatch(layoutAction.setActiveLinks(linksRelatorio));
        localStorage.setItem('activeLinks', 'relatorios');
        break;
      case 'Caixa':
        window.open('/pedidos/cadastrar', '_blank');
        break;
      case 'Produção':
        window.open('/producao', '_blank');
        break;
      default:
        break;
    }
    setClicked(!clicked);
  }

  const mainLinks = mainLinksMockdata.map((link: any) => {
      return (
        <Tooltip
          label={link.label}
          position="right"
          withArrow
          transitionDuration={0}
          key={link.label}
        >
          <UnstyledButton
            onClick={() => handleMainLinkClick(link.label)}
            className={cx(classes.mainLink, {
              [classes.mainLinkActive]: link.label === activeLink,
            })}
          >
            <link.icon stroke={1.5} />
          </UnstyledButton>
        </Tooltip>
      );
  });

  useEffect(() => {
    const links = activeLinks.map((link: any) => {
      return (
        <NavLink
          key={link.path + '' + link.label}
          className={cx(classes.link, {
            [classes.linkActive]: location.pathname === link.path,
          })}
          onClick={() => handleLinkClick(link.path)}
          children={
            link.childrens?.length &&
            link.childrens.map((children: any) => {
              return (
                <NavLink
                  className={cx(
                    classes.link,
                    {
                      [classes.linkActive]: location.pathname === children.path,
                    },
                    classes.childrenLink,
                  )}
                  onClick={() => handleLinkClick(children.path)}
                  label={children.label}
                />
              );
            })
          }
          label={link.label}
          icon={
            <ThemeIcon variant="filled">
              <link.icon size={18} />
            </ThemeIcon>
          }
        />
      );
    });
    setLinks(links);    
  }, [clicked]);

  return (
    <>
      <Navbar.Section grow className={classes.wrapper}>
        <div className={classes.aside}>
          <Box h={{ base: 45, md: 50 }} className={classes.logo}>
            <IconShoppingBag size={30} />
          </Box>
          {mainLinks}
        </div>
        <div className={classes.main}>
          <Title h={{ base: 45, md: 50 }} order={4} className={classes.title}>
            <Group position="apart" w={'100%'}>
              {activeLink}
              <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                <Burger
                  opened={opened}
                  onClick={() => dispatch(layoutAction.toggleNavBar())}
                  size="sm"
                  mr="xs"
                />
              </MediaQuery>
            </Group>
          </Title>
          <ScrollArea scrollbarSize={3} h="90vh">
            {links}
          </ScrollArea>
        </div>
      </Navbar.Section>
    </>
  );
}
