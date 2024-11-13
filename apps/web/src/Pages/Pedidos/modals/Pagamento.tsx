import { BillTable } from '../components/BillTable';
import { ActionIcon, Button, NumberInput, Paper, Text } from '@mantine/core';
import {
  IconCheck,
  IconCircleCheck,
  IconFileDescription,
  IconPencil,
  IconPercentage,
  IconTrash,
  IconUser,
  IconX,
} from '@tabler/icons';
import { closeAllModals, openModal } from '@mantine/modals';
import { Desconto } from './Desconto';
import { useEffect, useRef, useState } from 'react';
import { useCalc } from '../hooks/useCalc';
import { useAppDispatch, useAppSelector } from '../../../hooks/appStates';
import { useToggle } from '@mantine/hooks';
import { Cliente } from './Cliente';
import { pedidoSlice } from '../../../Store/pedido/pedido-slice';
import { useAuth0 } from '@auth0/auth0-react';
import { useUpdatePedido } from '../../../hooks/HandlePedido/useUpdatePedido';
import { gerarCodigoUnico } from '../../../utils/UniqueCode';
import { Recibo } from './Recibo';
import { CodigoPedido } from './CodigoPedido';
import { useGetCaixa } from '../../../hooks/HandleCaixa/useGetCaixaByUser';
import { notify } from '../../../Components/Modals/Notification';

export const Pagamento = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [payMethod, togglePayMethod] = useToggle([
    'CASH',
    'CCREDITO',
    'CDEBITO',
    'CHECK',
  ] as const);
  const pedido = useAppSelector((state) => state.pedido);
  const { totalLiq } = useCalc(pedido);
  const [pagamento, setPagamento] = useState(totalLiq);
  //const [completo, setCompleto] = useState('COMPLETO');
  const [troco, setTroco] = useState(0);
  const dispatch = useAppDispatch();
  const { user } = useAuth0();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setTroco(pagamento - totalLiq);
  }, [pagamento]);

  const { data: caixa, isLoading: isLoadingCaixa } = useGetCaixa(user?.email);

  const { mutate: update, isLoading } = useUpdatePedido();

  const handleSubmit = () => {
    if(caixa?.data.is_open){
      update(
        {
          id: pedido.id,
          id_instalacao: user?.id_instalacao,
          id_sessao: caixa?.data.id_sessao,
          id_caixa: caixa?.data.id,
          id_cliente: pedido.Cliente?.id,
          codigo: pedido.codigo,
          estado: 'COMPLETO',
          desconto: pedido.desconto,
          tipoPagamento: payMethod,
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
        },
        {
          onSuccess: () => {
            openModal({
              size: 800,
              title: 'Recibo',
              closeOnEscape: false,
              withCloseButton: false,
              closeOnClickOutside: false,
              overflow: 'inside',
              children: <Recibo />,
              onClose: () => {
                dispatch(pedidoSlice.actions.clear());
                dispatch(pedidoSlice.actions.setCodigo(gerarCodigoUnico()));
              },
            });
          },
        },
      );
    } else {
      notify({
        title: 'Atenção',
        type: 'error',
        message: 'Não pode registrar uma venda com o caixa encerrado.',
      });
    }
  };

  const handleRemover = () => {
    dispatch(pedidoSlice.actions.removeCliente());
  };

  return (
    <div className="h-[90vh] grid grid-cols-12 gap-1">
      <div className="h-full col-span-3">
        <Text className="text-2xl mb-3">Artigos</Text>
        <BillTable pagamento className="h-0" />
      </div>
      <div className="col-span-9 h-[100%]">
        <Text className="text-2xl mb-3">Acções</Text>
        <Paper p={6} withBorder className="h-[93%] rounded-none space-y-5">
          <div className="flex justify-between items-center">
            <Button
              size="lg"
              className="rounded-none"
              color="red"
              leftIcon={<IconX />}
              onClick={() => closeAllModals()}
            >
              Cancelar
            </Button>
            <div className="flex space-x-3">
              <Button
                size="lg"
                variant="outline"
                className="rounded-none"
                leftIcon={<IconPercentage />}
                onClick={() =>
                  openModal({
                    withCloseButton: false,
                    overlayOpacity: 0.3,
                    children: <Desconto />,
                  })
                }
              >
                Desconto
              </Button>
              <div className="relative">
                {pedido.Cliente && (
                  <IconCircleCheck className="absolute right-1 top-1 text-green-600" />
                )}
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-none"
                  leftIcon={<IconUser />}
                  onClick={() => {
                    openModal({
                      withCloseButton: false,
                      fullScreen: true,
                      children: <Cliente />,
                    });
                  }}
                >
                  Cliente
                </Button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12">
            <div className="col-span-2 space-y-3">
              <Text className="text-lg">Tipo de Pagamento</Text>
              <Button
                onClick={() => togglePayMethod('CASH')}
                fullWidth
                className="rounded-none"
                variant={payMethod == 'CASH' ? 'filled' : 'outline'}
              >
                Cash
              </Button>
              <Button
                onClick={() => togglePayMethod('CCREDITO')}
                fullWidth
                variant={payMethod == 'CCREDITO' ? 'filled' : 'outline'}
                className="rounded-none"
              >
                Cartão de Crédito
              </Button>
              <Button
                onClick={() => togglePayMethod('CDEBITO')}
                fullWidth
                variant={payMethod == 'CDEBITO' ? 'filled' : 'outline'}
                className="rounded-none"
              >
                Cartão de Débito
              </Button>
              <Button
                onClick={() => togglePayMethod('CHECK')}
                fullWidth
                variant={payMethod == 'CHECK' ? 'filled' : 'outline'}
                className="rounded-none"
              >
                Check
              </Button>
            </div>
            <div className="col-span-10 ml-10 space-y-3">
              <Text className="text-lg">Pagamento</Text>
              <div className="flex justify-between items-center">
                <span>Total:</span>
                <span className="text-xl font-bold">{totalLiq.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div>Pago:</div>
                <NumberInput
                  size="lg"
                  onChange={(value) => setPagamento(value || 0)}
                  ref={inputRef}
                  value={totalLiq}
                  hideControls
                  icon={<IconPencil />}
                  className="w-[30%] font-bold"
                />
              </div>
              {payMethod == 'CASH' && (
                <div className="flex justify-between items-center">
                  <span>Troco:</span>
                  <div className="text-xl font-bold ">
                    <span
                      className={troco >= 0 ? 'text-green-600' : 'text-red-600'}
                    >
                      {troco.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
              {pedido.Cliente && (
                <div className="flex justify-between items-center">
                  <div className="space-y-3">
                    <div className="text-xl flex items-center gap-2">
                      <IconUser />
                      {pedido.Cliente?.nome}
                    </div>
                    <div className="text-sm">NUIT: {pedido.Cliente?.nuit}</div>
                  </div>
                  <ActionIcon variant="filled" onClick={() => handleRemover()}>
                    <IconTrash />
                  </ActionIcon>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <Button
              size="lg"
              color="green"
              className="rounded-none"
              leftIcon={<IconFileDescription />}
              onClick={() =>
                openModal({
                  size: 800,
                  title: 'Recibo',
                  closeOnEscape: false,
                  withCloseButton: false,
                  closeOnClickOutside: false,
                  overflow: 'inside',
                  children: <Recibo />,
                })
              }
            >
              Imprimir Recibo
            </Button>
            <Button
              size="lg"
              color="green"
              className="rounded-none"
              leftIcon={<IconCheck />}
              onClick={() => handleSubmit()}
              loading={isLoading}
            >
              Registrar
            </Button>
          </div>
        </Paper>
      </div>
    </div>
  );
};
