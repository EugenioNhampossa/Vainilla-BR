import React from 'react';
import { TitleBar } from '../../Components/TitleBar';
import { Text, Paper, ThemeIcon, Title, UnstyledButton } from '@mantine/core';
import {
  IconFileDescription,
  IconReport,
  IconReportMoney,
  IconReportSearch,
} from '@tabler/icons';
import { Link } from 'react-router-dom';

const RelatoriosStock = () => {
  return (
    <>
      <TitleBar title={'Relatórios de Stock'} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-5">
        <UnstyledButton component={Link} to={'/relatorios/stock/count-sheet'}>
          <Paper
            shadow="sm"
            className="group p-4 flex flex-col justify-center items-center gap-4 hover:text-white hover:bg-[#228be6]"
          >
            <ThemeIcon size="xl">
              <IconReportSearch size={32} />
            </ThemeIcon>
            <Title order={4}>Stock Count Sheet</Title>
            <Text
              className="group-hover:text-white text-gray-400"
              align="center"
            >
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt
              iure nihil cupiditate doloribus autem.
            </Text>
          </Paper>
        </UnstyledButton>
        <UnstyledButton component={Link} to={'/relatorios/stock/stock-take'}>
          <Paper
            shadow="sm"
            className="group p-4 flex flex-col justify-center items-center gap-4 hover:text-white hover:bg-[#228be6]"
          >
            <ThemeIcon size="xl">
              <IconReportMoney size={32} />
            </ThemeIcon>
            <Title order={4}>Stock Take Report</Title>
            <Text
              className="group-hover:text-white text-gray-400"
              align="center"
            >
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt
              iure nihil cupiditate doloribus autem.
            </Text>
          </Paper>
        </UnstyledButton>
        <UnstyledButton component={Link} to={'/relatorios/stock/variance'}>
          <Paper
            shadow="sm"
            className="group p-4 flex flex-col justify-center items-center gap-4 hover:text-white hover:bg-[#228be6]"
          >
            <ThemeIcon size="xl">
              <IconReport size={32} />
            </ThemeIcon>
            <Title order={4}>Stock Variance</Title>
            <Text
              className="group-hover:text-white text-gray-400"
              align="center"
            >
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt
              iure nihil cupiditate doloribus autem.
            </Text>
          </Paper>
        </UnstyledButton>
        <UnstyledButton component={Link} to={'/relatorios/stock/item-recipes'}>
          <Paper
            shadow="sm"
            className="group group p-4 flex flex-col justify-center items-center gap-4 hover:text-white hover:bg-[#228be6]over:text-white hover:bg-[#228be6]"
          >
            <ThemeIcon size="xl">
              <IconFileDescription size={32} />
            </ThemeIcon>
            <Title order={4}>Item Recipes</Title>
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

export default RelatoriosStock;
