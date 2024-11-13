import { Button, TextInput } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';
import { IconHandStop, IconPencil } from '@tabler/icons';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/appStates';
import { pedidoSlice } from '../../../Store/pedido/pedido-slice';
import { gerarCodigoUnico } from '../../../utils/UniqueCode';

export const CodigoPedido = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const pedido = useAppSelector((state) => state.pedido);
  const [codigo, setCodigo] = useState<string>(pedido.codigo);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(pedidoSlice.actions.setCodigo(codigo));
    closeAllModals();
  };

  return (
    <div className="h-[80vh] flex flex-col items-center justify-center space-y-6">
      <IconHandStop size={64} />
      <form className="space-y-4" onSubmit={(e) => handleSubmit(e)}>
        <label className="text text-4xl">Pedido ou Nome do Cliente</label>
        <TextInput
          onChange={(e) => setCodigo(e.currentTarget.value)}
          ref={inputRef}
          value={gerarCodigoUnico()}
          placeholder="Insira o nome do pedido ou número"
          icon={<IconPencil />}
        />
        <div className="flex justify-center space-x-4">
          <Button type="button" onClick={() => closeAllModals()} color="red">
            Cancelar
          </Button>
          <Button type="submit">Continuar</Button>
        </div>
      </form>
    </div>
  );
};
