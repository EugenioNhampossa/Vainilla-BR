import { Grid, NumberInput, Text } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { setNota } from '../Store/contador/contador-slice';
import { RootState } from '../Store';

interface BankNoteCounterProps {
  valorDaNota: 1000 | 500 | 200 | 100 | 50 | 20 | 10 | 5 | 2 | 1 | 0.5;
  label: "Notas" | "Moedas";
}

function BankNoteCounter({ valorDaNota, label }: BankNoteCounterProps) {
  const dispatch = useDispatch();
  const amount = useSelector((state: RootState) => state.contador[valorDaNota.toString()]);

  const handleChange = (value: number | undefined) => {
    dispatch(setNota({ denomination: valorDaNota.toString(), amount: value || 0 }));
  };

  return (
    <>
      <Grid.Col span={2}>
        <Text>{label} de {valorDaNota}</Text>
      </Grid.Col>

      <Grid.Col span={2}>
        <NumberInput
          variant="filled"
          placeholder="Enter amount"
          type="number"
          min={0}
          precision={0}
          withAsterisk
          value={amount}
          onChange={handleChange}
        />
      </Grid.Col>
      <Grid.Col span={2}>
        <Text>= {amount * valorDaNota} MT</Text>
      </Grid.Col>
    </>
  );
}

export default BankNoteCounter;
