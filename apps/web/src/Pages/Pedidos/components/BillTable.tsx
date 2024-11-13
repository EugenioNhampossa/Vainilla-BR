import {
  BackgroundImage,
  Button,
  Divider,
  Paper,
  PaperProps,
  ScrollArea,
  Text,
} from '@mantine/core';
import {
  IconExclamationCircle,
  IconLock,
  IconLockOpen,
  IconRotate,
  IconTrash,
  IconX,
} from '@tabler/icons';
import React from 'react';
import { TableCard } from './TableCard';
import { useAppDispatch, useAppSelector } from '../../../hooks/appStates';
import { BillItem, pedidoSlice } from '../../../Store/pedido/pedido-slice';
import { closeAllModals, openConfirmModal, openModal } from '@mantine/modals';
import { Quantidade } from '../modals/Quantidade';
import { showNotification } from '@mantine/notifications';
import image from '../../../assets/trancar.svg';
import { useCalc } from '../hooks/useCalc';
import { gerarCodigoUnico } from '../../../utils/UniqueCode';
import { ulid } from 'ulid';
import { useRemoveOrder } from '../../../hooks/HandlePedido/useUpdatePedido';

interface TableProps extends PaperProps {
  pagamento?: boolean;
}

const BillTable = React.forwardRef<HTMLDivElement, TableProps>(
  ({ pagamento = false, ...props }, ref) => {
    const pedido = useAppSelector((state) => state.pedido);
    const dispatch = useAppDispatch();
    const { total, subtotal, totalLiq } = useCalc(pedido);
    const { mutate: remove, isLoading } = useRemoveOrder();

    const handleCardClick = (bill: BillItem) => {
      if (bill.id == pedido.selected?.id) {
        dispatch(pedidoSlice.actions.removeItemSelected());
      } else {
        dispatch(pedidoSlice.actions.selectItem(bill));
      }
    };

    const handleDeleteClick = () => {
      if (!pedido.bloqueado) {
        if (!pedido.selected?.confirmado) {
          dispatch(pedidoSlice.actions.removeItem());
        } else {
          showNotification({
            icon: <IconExclamationCircle />,
            message: 'Não se pode apagar um artigo confirmado',
          });
        }
      } else {
        showNotification({
          icon: <IconExclamationCircle />,
          message: 'Não se pode apagar um pedido bloqueado',
        });
      }
    };

    const handleQtyClick = () => {
      if (!pedido.bloqueado) {
        if (!pedido.selected?.confirmado) {
          openModal({
            title: 'Alterar Quantidade',
            overlayOpacity: 0.3,
            children: <Quantidade />,
          });
        } else {
          showNotification({
            icon: <IconExclamationCircle />,
            message:
              'Não se pode editar um produto confirmado. Adicione outro produto.',
          });
        }
      } else {
        showNotification({
          icon: <IconExclamationCircle />,
          message: 'Não se pode editar um pedido bloqueado',
        });
      }
    };

    const handleBlock = () => {
      if (pedido.ItemPedido.length > 0) {
        if (pedido.bloqueado) {
          dispatch(pedidoSlice.actions.setBloqueado(false));
        } else {
          dispatch(pedidoSlice.actions.setBloqueado(true));
        }
      } else {
        showNotification({
          icon: <IconExclamationCircle />,
          message: 'Não existem itens para bloquear',
        });
      }
    };

    const handleRepetir = () => {
      if (pedido.bloqueado) {
        pedido.ItemPedido.map((item) => {
          dispatch(
            pedidoSlice.actions.addItem({
              ...item,
              id_produto: ulid(),
              confirmado: false,
            }),
          );
        });
      } else {
        showNotification({
          icon: <IconExclamationCircle />,
          message: 'Não se pode editar um pedido bloqueado',
        });
      }
    };

    const anularPedido = () => {
      if (pedido.ItemPedido.length > 0) {
        openConfirmModal({
          title: 'Confirme',
          children: (
            <Text size="sm">Tem certeza que quer anular este pedido?</Text>
          ),
          labels: { confirm: 'Confirm', cancel: 'Cancel' },
          onCancel: () => closeAllModals(),
          onConfirm: () => {
            remove(pedido.id);
            dispatch(pedidoSlice.actions.clear());
            closeAllModals();
            // showNotification({
            //   message: 'Pedido Anulado.',
            //   color: 'green',
            //   icon: <IconCheck />,
            // });
          },
        });
      } else {
        showNotification({
          message: 'Sem artigos para anular.',
          color: 'red',
          icon: <IconExclamationCircle />,
        });
      }
    };

    return (
      <Paper
        {...props}
        ref={ref}
        withBorder
        className="p-2 flex flex-col gap-2 rounded-none"
      >
        {!pagamento && (
          <>
            <div className="h-[8%] grid grid-cols-3 gap-2">
              <Button
                className="h-full rounded-none p-0"
                color="red"
                disabled={!pedido.selected}
                leftIcon={<IconX />}
                onClick={() => handleDeleteClick()}
              >
                Apagar
              </Button>
              <Button
                className="h-full rounded-none p-0"
                variant="outline"
                color="gray"
                onClick={() => handleQtyClick()}
              >
                Quantidade
              </Button>
              <Button
                className="h-full rounded-none p-0"
                variant="outline"
                color="gray"
              >
                {pedido.codigo || gerarCodigoUnico()}
              </Button>
            </div>
            <Divider />
          </>
        )}
        <BackgroundImage src={pedido.bloqueado ? image : ''}>
          <ScrollArea
            scrollbarSize={5}
            className={
              pagamento
                ? 'h-[460px] flex flex-col gap-2'
                : 'h-[300px] flex flex-col gap-2'
            }
          >
            {pedido.ItemPedido.map((bill, index) => (
              <TableCard
                className={
                  pedido.selected?.id == bill.id ? 'bg-blue-400 text-white' : ''
                }
                key={'#' + bill + index}
                onClick={() => handleCardClick(bill)}
                index={index + 1}
                data={{
                  id: bill.id,
                  id_produto: bill.id_produto,
                  titulo: bill.titulo,
                  hora: bill.hora,
                  dataCriacao: bill.dataCriacao,
                  preco: bill.preco,
                  quantidade: bill.quantidade,
                  desconto: bill.preco - (bill.desconto * bill.preco) / 100,
                  confirmado: bill.confirmado,
                }}
              />
            ))}
          </ScrollArea>
        </BackgroundImage>
        <Divider />
        <div>
          <div className="space-y-2">
            {pedido.desconto > 0 && (
              <div className="flex justify-end">
                <span className="line-through">{total.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{subtotal.toFixed(2)}</span>
            </div>
          </div>
          <Divider variant="dashed" className="my-2" />
          <div className="flex justify-between">
            <Text weight="bold" size="xl">
              Total
            </Text>
            <Text weight="bold" size="xl">
              {totalLiq.toFixed(2)}
            </Text>
          </div>
        </div>
        {!pagamento && (
          <div className="h-[12%] grid grid-cols-3 gap-2">
            <Button
              onClick={() => anularPedido()}
              color="red"
              className="h-full border-none rounded-none p-0"
            >
              <div className="flex flex-col items-center">
                <IconTrash />
                <Text size="sm">Anular Pedido</Text>
              </div>
            </Button>
            <Button
              className="h-full border rounded-none p-0"
              variant="outline"
              color="gray"
              onClick={() => handleBlock()}
            >
              <div className="flex flex-col items-center">
                {pedido.bloqueado ? <IconLockOpen /> : <IconLock />}
                <Text size="sm">
                  {pedido.bloqueado ? 'Desbloquear' : 'Bloquear'}
                </Text>
              </div>
            </Button>
            <Button
              className="h-full border rounded-none p-0"
              variant="outline"
              color="gray"
              onClick={() => handleRepetir()}
            >
              <div className="flex flex-col items-center">
                <IconRotate />
                <Text size="sm">Repetir rod.</Text>
              </div>
            </Button>
          </div>
        )}
      </Paper>
    );
  },
);

export { BillTable };
