import { Button, Grid, Text } from '@mantine/core';
import { useSelector } from 'react-redux';
import { selectTotalSum } from '../Store/contador/selectTotalSumSelector';
import { IconX } from '@tabler/icons';
import { closeAllModals, openConfirmModal, useModals } from '@mantine/modals';
import { useCloseSession } from '../hooks/HandleCaixa/useUpdateCaixa';
import { RootState } from '../Store';
import { notify } from './Modals/Notification';
import type { ContadorState } from '../Store/contador/contador-slice';
import type {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from 'react-query';
import type { AxiosResponse } from 'axios';

interface ClossingSessionTriggerProps {
  totalPOS: number;
  totalVendas: number;
  caixaId: string;
  sessionId: string;
  refetch: any;
}

function SumOfTotal({
  totalPOS,
  totalVendas,
  caixaId,
  sessionId,
  refetch,
}: ClossingSessionTriggerProps) {
  const amount = useSelector(selectTotalSum);
  const contadorDeNumerario = useSelector((state: RootState) => state.contador);
  const totalGeral = amount;
  const modals = useModals();

  const { mutate: closeSession, isLoading: isClosing } = useCloseSession();

  function concatenatePrefixOnIndex(notas: ContadorState) {
    return Object.entries(notas).reduce<Record<string, number>>(
      (acc, [key, value]) => {
        const denomination = parseFloat(key);
        const label = denomination < 19 ? 'Moeda' : 'Nota';
        const newKey = `${label}${denomination.toString().replace('.', '')}`;
        acc[newKey] = value;
        return acc;
      },
      {},
    );
  }

  function handleCloseSession() {
    const differenceBetweenTotalSalesAndTotalObtained =
      totalVendas - (amount + totalPOS);
    if (differenceBetweenTotalSalesAndTotalObtained !== 0) {
      return notify({
        message: 'Valores não batem!',
        title: 'Erro',
        type: 'error',
      });
    }

    const notas = concatenatePrefixOnIndex(contadorDeNumerario);
    closeSession(
      {
        id: caixaId,
        closeSessionData: { ...notas, Pos: totalPOS, id_sessao: sessionId },
      },
      {
        onSuccess: async () => {
          notify({
            message: 'Caixa encerrado',
            title: 'Sucesso',
            type: 'success',
          });
          await refetch();
          modals.closeAll();
        },
      },
    );
  }

  return (
    <>
      <Grid>
        {/* Total Numerario */}
        <Grid.Col span={3}>
          <Text className="font-bold">Total em Numerario</Text>
        </Grid.Col>
        {/* Valor */}
        <Grid.Col span={3}>
          <Text>{amount} MT</Text>
        </Grid.Col>
        {/* Soma entre POS e Numerario */}
        <Grid.Col span={3}>
          <Text className="font-bold">Total Geral</Text>
        </Grid.Col>
        {/* Valor */}
        <Grid.Col span={3}>
          <Text>{totalGeral.toFixed(2)} MT</Text>
        </Grid.Col>
      </Grid>

      {/* Butoes de Confirmacao */}
      <div className="flex items-center justify-end gap-4 mt-10">
        <Button
          color="red"
          leftIcon={<IconX />}
          onClick={() => closeAllModals()}
        >
          Cancelar
        </Button>
        <Button
          // leftIcon={<IconPlus />}
          onClick={() =>
            openConfirmModal({
              title: (
                <Text size="sm" fw="bold">
                  Atenção!?
                </Text>
              ),
              children: <Text size="sm">Deseja fechar o caixa?</Text>,
              labels: {
                confirm: (
                  <Button loading={isClosing} color="orange">
                    Sim
                  </Button>
                ),
                cancel: 'Cancelar',
              },
              confirmProps: { color: 'orange' },
              onCancel: () => modals.closeAll(),
              onConfirm: () => {
                handleCloseSession();
              },
            })
          }
        >
          Fechar Caixa
        </Button>
      </div>
    </>
  );
}

export { SumOfTotal };
