import { TitleBar } from '../../Components/TitleBar';
import { Text, Paper, ThemeIcon, Title, UnstyledButton } from '@mantine/core';
import { IconCalendarStats, IconTag } from '@tabler/icons';
import { Link } from 'react-router-dom';

const RelatoriosPedidos = () => {
  return (
    <>
      <TitleBar title={'Relatórios de pedidos'} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-5">
        <UnstyledButton
          component={Link}
          to={'/relatorios/pedidos/vendas-por-periodo'}
        >
          <Paper
            shadow="sm"
            className="group p-4 flex flex-col justify-center items-center gap-4 hover:text-white hover:bg-[#228be6]"
          >
            <ThemeIcon size="xl">
              <IconCalendarStats size={32} />
            </ThemeIcon>
            <Title order={4}>Vendas por período </Title>
            <Text
              className="group-hover:text-white text-gray-400"
              align="center"
            >
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt
              iure nihil cupiditate doloribus autem.
            </Text>
          </Paper>
        </UnstyledButton>
        <UnstyledButton
          component={Link}
          to={'/relatorios/pedidos/vendas-por-produto'}
        >
          <Paper
            shadow="sm"
            className="group p-4 flex flex-col justify-center items-center gap-4 hover:text-white hover:bg-[#228be6]"
          >
            <ThemeIcon size="xl">
              <IconTag size={32} />
            </ThemeIcon>
            <Title order={4}>Vendas Por Produto</Title>
            <Text
              className="group-hover:text-white text-gray-400"
              align="center"
            >
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt
              iure nihil cupiditate doloribus autem.
            </Text>
          </Paper>
        </UnstyledButton>
      </div>
    </>
  );
};

export default RelatoriosPedidos;
