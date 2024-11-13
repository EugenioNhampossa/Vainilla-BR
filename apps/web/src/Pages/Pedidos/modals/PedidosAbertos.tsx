import { Button, Text } from '@mantine/core';
import { closeAllModals, openModal } from '@mantine/modals';
import { IconPlus, IconX } from '@tabler/icons';
import { DataTable } from 'mantine-datatable';
import { CodigoPedido } from './CodigoPedido';
import { Pedido, pedidoSlice } from '../../../Store/pedido/pedido-slice';
import { calculate, useCalc } from '../hooks/useCalc';
import { useAppDispatch } from '../../../hooks/appStates';
import { useGetOpenOrders } from '../../../hooks/HandlePedido/usePedidoData';

export const PedidosAbertos = () => {
  const dispatch = useAppDispatch();

  const { data, isLoading } = useGetOpenOrders();

  const colums = [
    { accessor: 'codigo', title: 'Pedido / Nome do Cliente' },
    { accessor: 'estado', title: 'Estado' },
    {
      accessor: 'total',
      title: 'Total',
      render: (pedido: Pedido) => {
        const { totalLiq } = calculate(pedido);
        return totalLiq.toFixed(2);
      },
    },
  ];

  return (
    <div>
      <Text className="text-lg mb-2">Pedidos Abertos</Text>
      <DataTable
        onRowClick={(record) => {
          dispatch(pedidoSlice.actions.setPedido(record));
          closeAllModals();
        }}
        records={data?.data}
        fetching={isLoading}
        striped
        highlightOnHover
        fontSize="md"
        className="h-[80vh]"
        columns={colums}
      />
      <div className="flex items-center justify-end gap-4">
        <Button
          color="red"
          leftIcon={<IconX />}
          onClick={() => closeAllModals()}
        >
          Fechar
        </Button>
        <Button
          leftIcon={<IconPlus />}
          onClick={() =>
            openModal({
              withCloseButton: false,
              fullScreen: true,
              children: <CodigoPedido />,
            })
          }
        >
          Nova Venda
        </Button>
      </div>
    </div>
  );
};
