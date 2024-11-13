import { Badge, Button, NumberInput, Text } from '@mantine/core';
import { useAppDispatch, useAppSelector } from '../../../hooks/appStates';
import { closeAllModals } from '@mantine/modals';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { pedidoSlice } from '../../../Store/pedido/pedido-slice';
import { showNotification } from '@mantine/notifications';
import { IconExclamationCircle } from '@tabler/icons';

export const Quantidade = () => {
  const pedido = useAppSelector((state) => state.pedido);
  const dispatch = useAppDispatch();
  const [qty, setQty] = useState(pedido.selected?.quantidade || 0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (qty > 0) {
      dispatch(pedidoSlice.actions.setQty(qty));
      closeAllModals();
    } else {
      showNotification({
        icon: <IconExclamationCircle />,
        message:"A quantidade não pode ser nula ou negativa"
      })
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Text mr={1}>Artigo:</Text>
        <Badge>{pedido.selected?.titulo}</Badge>
      </div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <NumberInput
          ref={inputRef}
          value={qty}
          onChange={(value) => setQty(value || 1)}
        />
        <div className="flex justify-center space-x-4 mt-4">
          <Button
            fullWidth
            type="button"
            onClick={() => closeAllModals()}
            color="red"
          >
            Cancelar
          </Button>
          <Button disabled={!pedido.selected} fullWidth type="submit">
            Alerar
          </Button>
        </div>
      </form>
    </div>
  );
};
