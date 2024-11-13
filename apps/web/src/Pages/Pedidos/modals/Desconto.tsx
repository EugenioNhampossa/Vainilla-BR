import { Button, Divider, NumberInput, Tabs, Text } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';
import {
  IconExclamationCircle,
  IconPercentage,
  IconTrash,
} from '@tabler/icons';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/appStates';
import { pedidoSlice } from '../../../Store/pedido/pedido-slice';
import { showNotification } from '@mantine/notifications';

export const Desconto = () => {
  const pedido = useAppSelector((state) => state.pedido);
  const dispatch = useAppDispatch();
  const [desconto, setDesconto] = useState({
    artigo: pedido.selected?.desconto || 0,
    carro: pedido.desconto,
  });

  const handleSubmitArtigo = () => {
    if (desconto.artigo >= 0) {
      dispatch(pedidoSlice.actions.setItemDesconto(desconto.artigo));
      closeAllModals();
    } else {
      showNotification({
        icon: <IconExclamationCircle />,
        message: 'O desconto não pode ser negativo!',
      });
    }
  };

  const handleSubmitCarro = () => {
    if (desconto.carro >= 0) {
      dispatch(pedidoSlice.actions.setDesconto(desconto.carro));
      closeAllModals();
    } else {
      showNotification({
        icon: <IconExclamationCircle />,
        message: 'O desconto não pode ser negativo!',
      });
    }
  };

  const handleClear = () => {
    dispatch(pedidoSlice.actions.clearDesconto());
    closeAllModals();
  };

  return (
    <div>
      <Tabs defaultValue="carro">
        <Tabs.List grow>
          <Tabs.Tab value="carro">Desconto de carro</Tabs.Tab>
          <Tabs.Tab value="artigo">Desconto de artigo</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="carro" pt="xs" className="space-y-6">
          <Text className="text-center text-xl">Aplicar desconto do carro</Text>
          <div className="flex justify-center">
            <NumberInput
              value={desconto.carro}
              onChange={(value) =>
                setDesconto({ ...desconto, carro: value || 0 })
              }
              rightSection={<IconPercentage />}
            />
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            <Button
              fullWidth
              type="button"
              onClick={() => closeAllModals()}
              color="red"
            >
              Cancelar
            </Button>
            <Button onClick={() => handleSubmitCarro()} fullWidth type="button">
              Aplicar
            </Button>
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="artigo" pt="xs" className="space-y-6">
          {pedido.selected ? (
            <>
              <Text className="text-center text-xl">
                Aplicar desconto no artigo {`"${pedido.selected.titulo}"`}
              </Text>
              <div className="flex justify-center">
                <NumberInput
                  value={desconto.artigo}
                  onChange={(value) =>
                    setDesconto({
                      ...desconto,
                      artigo: value || 0,
                    })
                  }
                  rightSection={<IconPercentage />}
                />
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <Button
                  fullWidth
                  type="button"
                  onClick={() => closeAllModals()}
                  color="red"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => handleSubmitArtigo()}
                  fullWidth
                  type="button"
                >
                  Aplicar
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center mb-4 text-gray-500 text-center">
              <IconExclamationCircle size={52} />
              <div>Artigo não está seleccionado.</div>
              <div>
                Seleccione um artigo da lista de venda antes de abrir esta caixa
                de dialogo.
              </div>
              <Button
                mt="md"
                color="red"
                variant="outline"
                onClick={() => closeAllModals()}
              >
                Fechar
              </Button>
            </div>
          )}
        </Tabs.Panel>
      </Tabs>
      <div className="mt-3">
        <Divider />
        <Button
          onClick={() => handleClear()}
          variant="subtle"
          fullWidth
          leftIcon={<IconTrash />}
        >
          Apagar Descontos
        </Button>
      </div>
    </div>
  );
};
