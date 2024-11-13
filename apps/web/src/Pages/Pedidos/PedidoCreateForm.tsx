import {
  Button,
  Divider,
  Group,
  Paper,
  Progress,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import {
  IconChefHat,
  IconCircleCheck,
  IconExclamationCircle,
  IconHandStop,
  IconList,
  IconPercentage,
  IconPlus,
  IconTransitionRight,
  IconUser,
} from '@tabler/icons';

import { ProdList } from './components/List';
import { CXButton } from './components/CXButton';
import { BillTable } from './components/BillTable';
import { useAppDispatch, useAppSelector } from '../../hooks/appStates';
import { openModal } from '@mantine/modals';
import { CodigoPedido } from './modals/CodigoPedido';
import { Desconto } from './modals/Desconto';
import { PedidosAbertos } from './modals/PedidosAbertos';
import { Pagamento } from './modals/Pagamento';
import { useHotkeys } from '@mantine/hooks';
import { pedidoSlice } from '../../Store/pedido/pedido-slice';
import { showNotification } from '@mantine/notifications';
import { gerarCodigoUnico } from '../../utils/UniqueCode';
import { Cliente } from './modals/Cliente';
import { useUpdatePedido } from '../../hooks/HandlePedido/useUpdatePedido';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useGetCaixa } from '../../hooks/HandleCaixa/useGetCaixaByUser';
import { MenuCaixa } from '../../Components/MenuCaixa';
import { useEffect } from 'react';
import { notify } from '../../Components/Modals/Notification';

const PedidoCreateForm = () => {
  const isLoading = useAppSelector(
    (state) => state.layout.caixa.isCaixaLoading,
  );
  const dispatch = useAppDispatch();
  const pedido = useAppSelector((state) => state.pedido);
  const navigate = useNavigate();

  const { logout, user } = useAuth0();

  const { data: caixa, isLoading: isLoadingCaixa } = useGetCaixa(user?.email);

  useEffect(() => {
    if (!isLoadingCaixa) {
      if (!caixa?.data) {
        openModal({
          withCloseButton: false,
          closeOnClickOutside: false,
          children: (
            <div className="space-y-5 flex flex-col items-center justify-center">
              <ThemeIcon size={80} color="red" variant="light">
                <IconExclamationCircle size={60} />
              </ThemeIcon>
              <Text>O usuário não está associado a um caixa!</Text>
              <Button
                onClick={() =>
                  logout({
                    logoutParams: {
                      returnTo: window.location.origin,
                    },
                  })
                }
              >
                Login
              </Button>
            </div>
          ),
        });
      }
    }
  }, [caixa, isLoadingCaixa]);

  useHotkeys([
    [
      'F1',
      () =>
        openModal({
          withCloseButton: false,
          fullScreen: true,
          children: <PedidosAbertos />,
        }),
    ],
    [
      'F2',
      () =>
        openModal({
          withCloseButton: false,
          fullScreen: true,
          children: <Pagamento />,
        }),
    ],
    [
      'F3',
      () =>
        openModal({
          withCloseButton: false,
          fullScreen: true,
          children: <Pagamento />,
        }),
    ],
  ]);

  const { mutate: update, isLoading: isUpdating } = useUpdatePedido();

  const handleSubmit = () => {
    if (caixa?.data.is_open) {
      update({
        id: pedido.id,
        id_instalacao: user?.id_instalacao,
        id_caixa: caixa?.data.id,
        id_sessao:caixa?.data.id_sessao,
        id_cliente: pedido.Cliente?.id,
        bloqueado:pedido.bloqueado,
        codigo: pedido.codigo,
        desconto: pedido.desconto,
        itens: pedido.ItemPedido.map((item) => {
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
      });
    } else {
      notify({
        title: 'Atenção',
        type: 'error',
        message: 'Não pode registrar uma venda com o caixa encerrado.',
      });
    }
  };

  const save = () => {
    handleSubmit();
  };

  const handleNewClick = () => {
    dispatch(pedidoSlice.actions.clear());
    dispatch(pedidoSlice.actions.setCodigo(gerarCodigoUnico()));
    openModal({
      fullScreen: true,
      children: <CodigoPedido />,
    });
  };

  const handlePagamentoClick = () => {
    if (pedido.ItemPedido.length > 0) {
      openModal({
        withCloseButton: false,
        fullScreen: true,
        children: <Pagamento />,
      });
    } else {
      showNotification({
        icon: <IconExclamationCircle />,
        message: 'Adicione artigos.',
      });
    }
  };

  const handleGravarClick = () => {
    if (pedido.ItemPedido.length > 0) {
      save();
      dispatch(pedidoSlice.actions.clear());
      dispatch(pedidoSlice.actions.setCodigo(gerarCodigoUnico()));
      // openModal({
      //   fullScreen: true,
      //   children: <CodigoPedido />,
      // });
    } else {
      showNotification({
        icon: <IconExclamationCircle />,
        message: 'Adicione artigos.',
      });
    }
  };

  const handleOpenList = () => {
    dispatch(pedidoSlice.actions.setCodigo(gerarCodigoUnico()));
    openModal({
      withCloseButton: false,
      fullScreen: true,
      children: <PedidosAbertos />,
    });
  };

  return (
    <div className="h-[97vh] space-y-1">
      <div>
        <Paper
          withBorder
          className="flex justify-between items-center p-2 gap-4 rounded-none"
        >
          <div className="flex flex-wrap items-center gap-2">
            <CXButton
              px={2}
              onClick={() => handleNewClick()}
              text="Nova Venda"
              icon={<IconPlus />}
            />
            <CXButton
              px={2}
              variant="outline"
              onClick={() => handleOpenList()}
              text="Pedidos Abertos"
              icon={<IconList />}
            />
            <div className="relative">
              {pedido.Cliente && (
                <IconCircleCheck className="absolute right-1 top-1 text-green-600" />
              )}
              <CXButton
                text="Cliente"
                icon={<IconUser />}
                variant="outline"
                onClick={() => {
                  openModal({
                    withCloseButton: false,
                    fullScreen: true,
                    children: <Cliente />,
                  });
                }}
              />
            </div>
            <CXButton
              text={pedido.codigo || '---'}
              icon={<IconHandStop />}
              variant="outline"
              onClick={() => {
                openModal({
                  fullScreen: true,
                  children: <CodigoPedido />,
                });
              }}
            />
            <CXButton
              text="Desconto"
              icon={<IconPercentage />}
              variant="outline"
              onClick={() =>
                openModal({
                  withCloseButton: false,
                  overlayOpacity: 0.3,
                  children: <Desconto />,
                })
              }
            />
            <Divider orientation="vertical" />
            <CXButton
              text="Gravar"
              icon={
                <Text weight="bolder" size="xl">
                  F1
                </Text>
              }
              onClick={() => handleGravarClick()}
              variant="outline"
            />
            <CXButton
              text="Pagamento"
              color="green"
              icon={
                <Text weight="bolder" size="xl">
                  F2
                </Text>
              }
              onClick={() => handlePagamentoClick()}
            />
            <CXButton
              text="Cash"
              icon={
                <Text weight="bolder" size="xl">
                  F3
                </Text>
              }
              variant="outline"
            />
            <CXButton
              text="Produção"
              icon={<IconChefHat />}
              variant="outline"
              onClick={() => navigate('/producao/pedidos')}
            />
          </div>
          <div>
            <MenuCaixa />
          </div>
        </Paper>
        <div className="h-1">
          {(isLoading || isUpdating) && (
            <Progress size="xs" value={100} striped animate />
          )}
        </div>
      </div>
      <div className="h-[88%] grid grid-cols-4 gap-1">
        <BillTable />
        <ProdList
          withBorder
          className="col-span-3 p-2 rounded-none space-y-1"
        />
      </div>
    </div>
  );
};

export default PedidoCreateForm;
