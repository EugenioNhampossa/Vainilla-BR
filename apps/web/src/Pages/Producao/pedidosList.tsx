import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Progress,
  Select,
  TextInput,
  Title,
} from '@mantine/core';
import { AvatarMenu } from '../../Components/AvatarMenu';
import { Link } from 'react-router-dom';
import { TableCard } from '../Pedidos/components/TableCard';
import { useGetOpenOrders } from '../../hooks/HandlePedido/usePedidoData';
import { Pedido } from '../../Store/pedido/pedido-slice';
import { IconExclamationCircle, IconRefresh } from '@tabler/icons';
import { useEffect, useState } from 'react';
import { useUpdatePedido } from '../../hooks/HandlePedido/useUpdatePedido';
import { useAuth0 } from '@auth0/auth0-react';
import { useDebouncedState } from '@mantine/hooks';
import { notify } from '../../Components/Modals/Notification';
import { showNotification } from '@mantine/notifications';
import { MenuCaixa } from '../../Components/MenuCaixa';

export const PedidosList = () => {
  const [selected, setSelected] = useState<Pedido | null>(null);
  const [filtro, setFiltro] = useDebouncedState(
    {
      codigo: '',
      estado: 'TODOS',
    },
    300,
  );
  const [stats, setStats] = useState({
    total: 0,
    completos: 0,
    em_espera: 0,
    em_processo: 0,
  });
  const { user } = useAuth0();

  const {
    data: pedidos,
    refetch,
    isFetching,
  } = useGetOpenOrders({ codigo: filtro.codigo, estado: filtro.estado });

  const { mutate: update, isLoading } = useUpdatePedido();

  function handleChangeState(state: 'EM_PROCESSO' | 'COMPLETO') {
    if (selected) {
      if (state != selected.estado) {
        update(
          {
            id: selected.id,
            id_instalacao: user?.id_instalacao,
            id_cliente: selected.Cliente?.id,
            codigo: selected.codigo,
            estado: state,
            desconto: selected.desconto,
            itens: selected.ItemPedido.map((item) => {
              return {
                id: item.id,
                id_produto: item.id_produto,
                quantidade: item.quantidade,
                desconto: item.desconto,
                titulo: item.titulo,
                preco: item.preco,
                confirmado: item.confirmado,
              };
            }),
          },
          {
            onSuccess: () => {
              refetch();
              setSelected({ ...selected, estado: state });
            },
          },
        );
      } else {
        showNotification({
          icon: <IconExclamationCircle />,
          message: 'O pedido já se encontra no estado seleccionado.',
        });
      }
    } else {
      showNotification({
        icon: <IconExclamationCircle />,
        message: 'Seleccione um pedido',
      });
    }
  }

  function onSelectChange(value: string) {
    setFiltro({ ...filtro, estado: value });
  }

  useEffect(() => {
    if (pedidos?.data) {
      let total = pedidos.data.length;
      let completos = 0;
      let em_espera = 0;
      let em_processo = 0;

      pedidos.data.forEach((pedido: Pedido) => {
        if (pedido.estado === 'EM_ESPERA') em_espera++;
        if (pedido.estado === 'COMPLETO') completos++;
        if (pedido.estado === 'EM_PROCESSO') em_processo++;
      });

      setStats({
        total,
        completos,
        em_espera,
        em_processo,
      });
    }
  }, [pedidos, refetch]);

  function getEstado(estado: string) {
    switch (estado) {
      case 'EM_ESPERA':
        return (
          <Title order={6} c="red">
            Em espera
          </Title>
        );
      case 'EM_PROCESSO':
        return (
          <Title order={6} c="orange">
            Em processo
          </Title>
        );
      case 'COMPLETO':
        return (
          <Title order={6} c="green">
            Completo
          </Title>
        );
    }
  }

  function getCard(pedido: Pedido) {
    switch (pedido.estado) {
      case 'EM_ESPERA':
        return (
          <Paper
            radius={0}
            withBorder
            className="flex flex-col items-center p-4 gap-3 justify-around hover:cursor-pointer border-red-500 text-red-500"
            onClick={() => setSelected(pedido)}
          >
            <div className="font-semibold">{`#${pedido.codigo}`}</div>
          </Paper>
        );
      case 'EM_PROCESSO':
        return (
          <Paper
            radius={0}
            withBorder
            className="flex flex-col items-center p-4 gap-3 justify-around hover:cursor-pointer border-orange-500 text-orange-500"
            onClick={() => setSelected(pedido)}
          >
            <div className="font-semibold">{`#${pedido.codigo}`}</div>
          </Paper>
        );
      case 'COMPLETO':
        return (
          <Paper
            radius={0}
            withBorder
            className="flex flex-col items-center p-4 gap-3 justify-around hover:cursor-pointer border-green-500 text-green-500"
            onClick={() => setSelected(pedido)}
          >
            <div className="font-semibold">{`#${pedido.codigo}`}</div>
          </Paper>
        );
    }
  }

  return (
    <Box className="flex flex-col gap-1 ">
      <Paper
        withBorder
        radius={0}
        h={60}
        p="sm"
        className="flex justify-between items-center"
      >
        <Box className="flex items-center gap-3">
          <Link to="/producao/pedidos">
            <Button radius={0} size="md">
              Pedidos
            </Button>
          </Link>
          <Link to="/producao">
            <Button radius={0} size="md" variant="outline">
              Produção
            </Button>
          </Link>
          <Link to="/pedidos/cadastrar">
            <Button radius={0} size="md" variant="outline">
              Caixa
            </Button>
          </Link>
        </Box>
        <MenuCaixa />
      </Paper>
      <Box className="h-1">
        {(isFetching || isLoading) && (
          <Progress radius={0} size="sm" value={100} striped animate />
        )}
      </Box>
      <Grid gutter={5} className="flex-grow">
        <Grid.Col span={4}>
          <Paper withBorder radius={0} p="sm">
            <div className="flex items-center justify-between min-h-[5vh]">
              {selected && (
                <>
                  <Title order={2}>{`#${selected?.codigo}`}</Title>
                  <div className="flex flex-col">
                    {getEstado(selected?.estado)}
                  </div>
                </>
              )}
            </div>
            <Divider className="my-2" />
            <div className="flex flex-col gap-2 h-[59.4vh] overflow-scroll">
              {selected?.ItemPedido.map((item, index) => (
                <TableCard
                  key={item.id}
                  data={{
                    confirmado: item.confirmado,
                    desconto: item.desconto,
                    preco: item.preco,
                    quantidade: item.quantidade,
                    titulo: item.titulo,
                    id: item.id,
                    id_produto: item.id_produto,
                    dataCriacao: item.dataCriacao,
                  }}
                  index={index + 1}
                />
              ))}
            </div>
            <Divider className="my-2" />
            <div className="h-[12vh]">
              <span className="text-lg">Mudar estado para:</span>
              <div className="flex gap-2 flex-1 h-[70%]">
                <Button
                  onClick={() => handleChangeState('EM_PROCESSO')}
                  radius={0}
                  disabled={selected?.estado == 'COMPLETO'}
                  className="flex-grow h-full"
                  color="orange"
                >
                  Em Processo
                </Button>
                <Button
                  onClick={() => handleChangeState('COMPLETO')}
                  radius={0}
                  disabled={selected?.estado == 'COMPLETO'}
                  className="flex-grow h-full"
                  color="green"
                >
                  Completo
                </Button>
              </div>
            </div>
          </Paper>
        </Grid.Col>
        <Grid.Col span={8}>
          <div className="flex flex-col gap-1">
            <Paper withBorder radius={0} className="h-[77vh] space-y-3" p="sm">
              <div className="flex items-center">
                <Select
                  variant="unstyled"
                  className="pl-2 border border-solid border-gray-300"
                  radius={0}
                  onChange={(value) => onSelectChange(value || '')}
                  data={[
                    { value: 'TODOS', label: 'Todos' },
                    { value: 'COMPLETO', label: 'Completos' },
                    { value: 'EM_PROCESSO', label: 'Em processo' },
                    { value: 'EM_ESPERA', label: 'Em espera' },
                  ]}
                  value={filtro.estado}
                />
                <TextInput
                  variant="unstyled"
                  className="flex-grow pl-2 border border-solid border-gray-300 border-l-0"
                  placeholder="Pesquise pelo código..."
                  onChange={(e) =>
                    setFiltro({ ...filtro, codigo: e.currentTarget.value })
                  }
                />
                <Button
                  radius={0}
                  variant="light"
                  className="border h-[38px] border-solid border-gray-300 border-l-0"
                  leftIcon={<IconRefresh />}
                  onClick={() => refetch()}
                >
                  Actualizar
                </Button>
              </div>
              <div className="grid gap-2 grid-cols-6 grid-flow-row auto-rows-max h-[90%] overflow-scroll">
                {pedidos?.data.map((pedido: Pedido) => getCard(pedido))}
              </div>
            </Paper>
            <Paper
              withBorder
              radius={0}
              p="sm"
              className="flex gap-3 items-center justify-between"
            >
              <Box className="font-semibold text-lg">{`Total: ${stats.total}`}</Box>
              <Box
                className="font-semibold text-lg"
                c="red"
              >{`Em espera: ${stats.em_espera}`}</Box>
              <Box
                className="font-semibold text-lg"
                c="orange"
              >{`Em processo: ${stats.em_processo}`}</Box>
              <Box
                className="font-semibold text-lg"
                c="green"
              >{`Completos: ${stats.completos}`}</Box>
            </Paper>
          </div>
        </Grid.Col>
      </Grid>
    </Box>
  );
};
