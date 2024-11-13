import {
  IconBasket,
  IconBuildingStore,
  IconBuildingWarehouse,
  IconCash,
  IconFlag,
  IconGauge,
  IconPackages,
  IconReportMoney,
  IconShoppingBag,
  IconShoppingCart,
  IconTags,
  IconTruck,
  IconUsers,
} from '@tabler/icons';
import { Role } from '../utils/role.enum';

export const linksDefinicoes = [
  {
    label: 'Usuarios',
    path: '/usuarios',
    icon: IconUsers,
    accessRoles: [Role.admin, Role.superAdmin],
  },

  {
    label: 'Stock',
    path: '/stock/definicoes',
    icon: IconPackages,
    accessRoles: [Role.admin, Role.superAdmin],
  },
];

export const linksRelatorio = [
  {
    label: 'Pedidos',
    path: '/relatorio/pedidos',
    icon: IconReportMoney,
  },
  {
    label: 'Stock',
    path: '/relatorios/stock',
    icon: IconPackages,
  },
];

export const linksGestao = [
  {
    label: 'Bem-vindo',
    path: '/',
    icon: IconFlag,
  },
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: IconGauge,
  },
  {
    label: 'Artigos',
    icon: IconShoppingBag,
    childrens: [
      {
        label: 'Artigos',
        path: '/artigos',
      },
      {
        label: 'Família/Subfamília',
        path: '/familias',
      },
      {
        label: 'Marcas',
        path: '/marcas',
      },
    ],
  },
  {
    label: 'Produtos',
    icon: IconTags,
    childrens: [
      {
        label: 'Produtos',
        path: '/produtos',
      },
      {
        label: 'Categorias',
        path: '/categorias',
      },
    ],
  },
  {
    label: 'Pedidos',
    icon: IconShoppingCart,
    childrens: [
      {
        label: 'Clientes',
        path: '/clientes',
      },
      {
        label: 'Pedidos',
        path: '/pedidos',
      },
    ],
  },
  {
    label: 'Compras',
    icon: IconTruck,
    childrens: [
      {
        label: 'Fornecedores',
        path: '/fornecedores',
      },
      {
        label: 'Compras',
        path: '/compras',
      },
    ],
  },
  {
    label: 'Instalações',
    icon: IconBuildingStore,
    childrens: [
      {
        label: 'Instalações',
        path: '/instalacoes',
      },
    ],
  },
  {
    label: 'Stock',
    icon: IconBuildingWarehouse,
    childrens: [
      {
        label: 'Stock',
        path: '/stock',
      },
      {
        label: 'Tranferências',
        path: '/transferencias',
      },
      {
        label: 'Movimentos',
        path: '/movimentos',
      },
    ],
  },
  {
    label: 'Caixas',
    icon: IconCash,
    childrens: [
      {
        label: 'Caixas',
        path: '/caixas',
      },
      {
        label: 'Movimentos do Caixa',
        path: '/caixa',
      },
    ],
  },
];
