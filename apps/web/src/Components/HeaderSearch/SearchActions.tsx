import type { SpotlightAction } from '@mantine/spotlight';
import { IconHome, IconDashboard, IconShoppingCart } from '@tabler/icons';

export const actions: SpotlightAction[] = [
  {
    title: 'Home',
    description: 'Ir a página inicial',
    onTrigger: () => console.log('Home'),
    icon: <IconHome size={18} />,
  },
  {
    title: 'Dashboard',
    description:
      'Obtenha informações completas sobre o status atual do sistema',
    onTrigger: () => console.log('Dashboard'),
    icon: <IconDashboard size={18} />,
  },
  {
    title: 'Pedidos',
    description: 'Realize pedidos sobre os produtos registrados',
    onTrigger: () => console.log('Documentation'),
    icon: <IconShoppingCart size={18} />,
  },
];
